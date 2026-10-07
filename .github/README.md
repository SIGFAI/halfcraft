# HalfCraft

Play Half-Life 2 as a Minecraft player: build on its maps, fight the Combine with a diamond sword, light City 17 with torches.

**HalfCraft is made by [whisky (whiskydumb)](https://github.com/whisky (whiskydumb)).** All credit for the mod goes to them. It is built on [chasmlol/SkyCraft](https://github.com/chasmlol/SkyCraft) by chasmlol (SkyCraft).

- Original project: https://github.com/whiskydumb/halfcraft
- Report bugs and ask questions there: https://github.com/whiskydumb/halfcraft/issues
- Upstream version packaged here: 0.1.0 (commit [`1567b0b`](https://github.com/whiskydumb/halfcraft/tree/1567b0be95f37912d376b788dd495d965b20b8d9))
- **Built by SIGF from commit [`1567b0be95f37912d376b788dd495d965b20b8d9`](https://github.com/whiskydumb/halfcraft/tree/1567b0be95f37912d376b788dd495d965b20b8d9)**, on a disposable build machine (AWS EC2 i-0ce16aee59cfee816 (c6i.2xlarge, Windows Server 2022, eu-west-1 default VPC, no inbound, SSM only; terminated after the build); VS 2022 Build Tools MSVC 14.44.35207 (v143, CL/_LINK_=/Brepro), JDK Temurin 25 + Gradle 9.7.1 wrapper). The app installs these SIGF builds, not binaries from the author.

> **Beta.** Nobody at SIGF has played this build yet. Back up your saves.
> Bugs in the mod itself go to the author's issue tracker above; problems with the one-click install go to this repository's issues.

## What you need

- **Half-Life 2** ([Steam](https://store.steampowered.com/app/220/)): current Steam build (the mod ships its own game DLLs; HL2, both episodes and Lost Coast mounted from the Steam install).
- **Minecraft**: Java Edition 26.3.
- Windows and the [SIGF app](https://sigf.ai). The app installs fabric-loader 0.19.5, fabric-api 0.161.0+26.3 for you.

## Install

In the SIGF app, open **HalfCraft** in the catalog, press **Install**, then **Play**. **Restore** puts your game folders back exactly as they were.
The app follows `mashup.json` in this repository: every download is pinned by sha256. The files come from the release [`v0.1.0`](../../releases/tag/v0.1.0).

### How to play

- Half-Life 2, both episodes and Lost Coast as one campaign, but you move, build and fight as Steve with Minecraft's physics, hotbar and inventory.
- Press Play: Minecraft waits on its title screen, then hides and opens its mirror world by itself once Half-Life 2 is up. Start a new game as usual.
- Half-Life's weapons become hotbar items: hold one to take it out, mouse buttons fire and alt-fire, R reloads. G is use (pick up props), V the flashlight.
- Place and break blocks on Half-Life's maps; NPCs and physics props bump into what you build. Loading a save rolls Minecraft back with it.

### Good to know

- You need Half-Life 2 on Steam (Episodes One and Two and Lost Coast come with it) and a Minecraft: Java Edition account; the first Play signs you in through Prism.
- Single player only. HalfCraft runs as its own Source mod folder inside the app: your Half-Life 2 install and saves are not touched, and Restore removes it.
- Built by SIGF from the author's source (no upstream release yet); nobody has played this exact build. Beta: report bugs to the author on the upstream issue tracker.

## Built by SIGF

HalfCraft has no upstream release. SIGF built this commit unchanged on a disposable Windows builder: `tools/setup_sdk.ps1 -Engine hl2` and `tools/build_hl2.ps1 -Engine hl2 -NoLauncher` (VS 2022 Build Tools, MSVC v143 with `/Brepro`), `minecraft/gradlew build` (JDK 25). Two builds from fresh trees were byte-identical. The mod folder runs from the SIGF app's own folder with `hl2.exe -game <folder>`; Half-Life 2's content is mounted from the player's Steam install.

## What this repository holds

1. The upstream source tree at commit [`1567b0be95f37912d376b788dd495d965b20b8d9`](https://github.com/whiskydumb/halfcraft/tree/1567b0be95f37912d376b788dd495d965b20b8d9), every file unchanged (same git blobs). Upstream's own `README.md` is there, unchanged; GitHub shows this file (`.github/README.md`) first.
2. Added by SIGF in the same commit: this file, and `sigf/` (the scripts that built the release assets, for reference: they run inside the SIGF repository).
3. `mashup.json`, the SIGF app recipe (the next commit).
4. The release `v0.1.0` (its tag is the first commit):

| Asset | Size | sha256 | What it is |
|---|---|---|---|
| `halfcraft-hl2.zip` | 5956178 B | `9053889de41537c7a9a16878ab0aa803f787a2dc76ae3f3ca1f03277c31d885f` | the SIGF build of the mod folder `build/game-hl2` from the pinned commit (`bin/client.dll`, `bin/server.dll` with MSVC v143 `/Brepro`, the two compiled shaders, and the cfg/resource/scripts/commentary text files of the pinned SDK trees hl2dm-sp `67f81f0f` and Valve's source-sdk-2013 `0d8dcee`), without the .pdb files, plus upstream's LICENSE and THIRD-PARTY-NOTICES and the Source 1 SDK License under `halfcraft-licenses/`; into the mashup's own folder, never into Half-Life 2. |
| `halfcraft.mrpack` | 306708 B | `f75c8145607ba074151aa9fc39bf2c4df347446680768703b78bb3641a5367f4` | the Minecraft side: the SIGF build of `halfcraft-0.1.0.jar` from the pinned commit, with upstream's LICENSE, for Minecraft 26.3 with Fabric Loader 0.19.5; Fabric API 0.161.0+26.3 is a Modrinth download link, not stored here. |

The sha256 of every file inside the zips is in `mashup.json` (`contents`).

## Licenses

| Part | License | Where |
|---|---|---|
| HalfCraft (all of the upstream tree, and the SIGF builds) | MIT, Copyright 2026 whisky and chasmlol (SkyCraft) | `LICENSE`, `THIRD-PARTY-NOTICES.md` |
| Source SDK 2013 code and files in `halfcraft-hl2.zip` (Valve; hl2dm-sp) | Source 1 SDK License: free distribution of a mod that runs on Valve's Source games | `halfcraft-licenses/SourceSDK2013-LICENSE.txt` in the zip, https://github.com/ValveSoftware/source-sdk-2013 |
| Fabric API (downloaded from Modrinth by the app, not stored here) | Apache-2.0 | https://github.com/FabricMC/fabric |

## Why this repository exists

The SIGF app (https://sigf.ai) installs mods from recipes (`mashup.json`) whose downloads are pinned release files. This repository makes HalfCraft installable in one click, credited to whisky (whiskydumb). If you are the author and want anything changed or taken down, open an issue here.
