// HalfCraft (whiskydumb, MIT; SkyCraft design by chasmlol): Half-Life 2 played as a Minecraft player. A Source SDK 2013
// mod (client.dll + server.dll, mod_episodic) linked over the shared memory Local\HalfCraft_v1 to a hidden Minecraft
// 26.3 running the Fabric mod `halfcraft`. No upstream release: SIGF built the pinned commit on a disposable AWS builder
// (library/QC.md section 4; source.json "built"), source unchanged, engine `hl2` (Half-Life 2's own hl2.exe).
// The whole mod folder (build/game-hl2, made only from the pinned SDK trees and the mod's own files) goes into the
// mashup's own folder {app}/game-hl2: nothing is written into the Half-Life 2 install, and Half-Life 2's content is
// mounted at runtime through gameinfo.txt's |all_source_engine_paths|. Minecraft runs in the app's Prism instance;
// client.dll then finds no bundled Prism and leaves Minecraft to the app (hc_minecraft.cpp:37-40).
//   SIGF_LIBRARY_BUILDS=<dir> node library/halfcraft/build.mjs      (outputs: library/lib.mjs)
import { mrpack, resolveFabricApi } from '../../orchestrator/src/recipe.js';
import { asset, card, dl, emit, player, rawAt, zipAsset } from '../lib.mjs';
import { builtArtifacts, builtField, sourceOf } from '../um-gta5-passthrough/sigf-build.mjs';

const ID = 'halfcraft', VERSION = '0.1.0', NAME = 'HalfCraft';
const SRC = sourceOf(ID);
const UP = { repo: SRC.repo, commit: SRC.commit, authors: ['whisky (whiskydumb)'] };
const MC = { mc: '26.3', loader: '0.19.5', fabricApi: '0.161.0+26.3', java: '25' }; // minecraft/gradle.properties at the commit
const JAR = 'halfcraft-0.1.0.jar';
const TAGLINE = 'Play Half-Life 2 as a Minecraft player: build on its maps, fight the Combine with a diamond sword, light City 17 with torches.';
const VALVE = { repo: 'https://github.com/ValveSoftware/source-sdk-2013', commit: SRC.built.sdk['ValveSoftware/source-sdk-2013'] };

const files = builtArtifacts(ID);
const notices = await rawAt(UP.repo, UP.commit, 'THIRD-PARTY-NOTICES.md');
const sdkLicense = await rawAt(VALVE.repo, VALVE.commit, 'LICENSE');
const game = zipAsset(`${ID}-hl2.zip`, [
  ...[...files].filter(([n]) => n.startsWith('game-hl2/')).map(([n, data]) => ({ name: n.slice('game-hl2/'.length), data })),
  { name: 'halfcraft-licenses/LICENSE.txt', data: files.get('LICENSE') },
  { name: 'halfcraft-licenses/THIRD-PARTY-NOTICES.md', data: notices },
  { name: 'halfcraft-licenses/SourceSDK2013-LICENSE.txt', data: sdkLicense },
]);
const fabricApi = await resolveFabricApi(MC.fabricApi, MC.mc);
if (!fabricApi?.download) throw new Error(`Fabric API ${MC.fabricApi} not resolved on Modrinth`);
const pack = asset(`${ID}.mrpack`, mrpack({ name: NAME, summary: TAGLINE, versions: MC, versionId: VERSION, fabricApi,
  jars: [{ name: JAR, data: files.get(JAR) }], extra: [{ name: 'overrides/licenses/halfcraft-LICENSE.txt', data: files.get('LICENSE') }] }));
const assets = [game, pack];

const make = (urls, set) => {
  const mp = set.find(a => a.name.endsWith('.mrpack'));
  return {
    id: `sigf/${ID}`,
    version: VERSION,
    name: NAME,
    tagline: player(ID).tagline ?? TAGLINE,
    how_to_play: player(ID).howToPlay,
    kind: 'passthrough',
    games: [
      { game: 'halflife2', role: 'host', label: 'Half-Life 2', engine: 'Source (2013 SDK, 32-bit hl2.exe) + HalfCraft mod (client.dll/server.dll, mod_episodic, C++)', apps: { steam: '220' }, runtime: 'current Steam build (the mod ships its own game DLLs; HL2, both episodes and Lost Coast mounted from the Steam install)' },
      { game: 'minecraft', role: 'guest', label: 'Minecraft', engine: 'Minecraft Java 26.3 + Fabric mod halfcraft (Java)', mc: MC.mc, loader: `fabric@${MC.loader}`, java: MC.java },
    ],
    requires: [
      { id: 'fabric-loader', version: MC.loader },
      { id: 'fabric-api', version: MC.fabricApi, note: 'in the Minecraft pack (downloaded from Modrinth)' },
    ],
    install: [
      { game: 'halflife2', strategy: 'profile', files: [
        { src: game.name, dst: '{app}/game-hl2', unpack: true, contents: game.contents, ...dl(game, urls) },
      ] },
      // -Dhalfcraft.startHidden=true: upstream's instance flag (its --enable-native-access is not on the app's
      // whitelist and only silences a Java 25 warning).
      { game: 'minecraft', strategy: 'mrpack', jvm_args: ['-Dhalfcraft.startHidden=true'], pack: { src: mp.name, ...dl(mp, urls) } },
    ],
    // Minecraft first: it waits on its title screen and opens its mirror world itself once Half-Life 2 is up (no port).
    launch: [
      { game: 'minecraft' },
      { game: 'halflife2', exe: 'hl2.exe', args: ['-game', '{app}/game-hl2', '-novid'] },
    ],
    files: set.map(a => ({ name: a.name, ...dl(a, urls) })),
    source: {
      repo: UP.repo, license: 'MIT AND LicenseRef-Source-1-SDK', upstream_license: SRC.license, commit: UP.commit,
      hosted: `https://github.com/SIGFAI/${ID}`,
      based_on: 'https://github.com/chasmlol/SkyCraft',
      built: builtField(ID),
    },
    media: {},
    built_by: { author: UP.authors[0], authors: [...UP.authors, 'chasmlol (SkyCraft)'], packaged_by: 'SIGF' },
    idea_by: UP.authors[0],
    built_at: '2026-10-07T00:00:00.000Z',
    ...card(UP.repo),
    notes: player(ID).notes,
  };
};

emit({ slug: ID, version: VERSION, assets, make });
