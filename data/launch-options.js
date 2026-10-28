/* Steam launch option data for the launchcommands page and app panel. */
(function () {
  "use strict";

var CATS = [
  {id:"all",     label:"All"},
  {id:"nvidia",  label:"NVIDIA"},
  {id:"amd",     label:"AMD"},
  {id:"proton",  label:"Proton / Linux"},
  {id:"engine",  label:"Engine flags"},
  {id:"tool",    label:"Tools / Debug"},
  {id:"general", label:"General"}
];

var OPTIONS = [
  /* ---- General, engine-agnostic ---- */
  {k:"-novid", c:["general"], ex:"Skip the intro/logo videos (Valve titles and many others)."},
  {k:"-high", c:["general"], ex:"Run the game with high OS process priority."},
  {k:"-fullscreen", c:["general"], ex:"Force exclusive fullscreen."},
  {k:"-windowed", c:["general"], ex:"Start in windowed mode."},
  {k:"-noborder", c:["general"], ex:"Borderless window; normally paired with -windowed."},
  {k:"-borderless", c:["general"], cr:true, ex:"Borderless fullscreen on engines that support it."},
  {k:"-w <width>", c:["general"], ex:"Set window width, e.g. -w 1920."},
  {k:"-h <height>", c:["general"], ex:"Set window height, e.g. -h 1080."},
  {k:"-refresh <rate>", c:["general"], ex:"Force refresh rate, e.g. -refresh 144."},
  {k:"-freq <rate>", c:["general"], cr:true, ex:"Alternative refresh-rate flag on some engines."},
  {k:"-threads <n>", c:["general"], ex:"Limit worker threads; only honored by some titles."},
  {k:"-autoconfig", c:["general"], ex:"Re-detect video settings on next launch."},
  {k:"-safe", c:["general"], ex:"Start with safe/minimal display settings."},
  {k:"-console", c:["general"], ex:"Enable the developer console if the game has one."},
  {k:"-nosound", c:["general"], ex:"Disable audio output."},
  {k:"-language <code>", c:["general"], ex:"Force language, e.g. -language english."},
  {k:"-noasync", c:["general"], cr:true, ex:"Disable asynchronous loading; can lengthen load times."},
  {k:"-nosplash", c:["general"], ex:"Skip splash screens."},
  {k:"-nolog", c:["general"], ex:"Disable the game's own log file."},
  {k:"-dev", c:["general"], ex:"Developer mode if the title exposes it."},
  {k:"-benchmark", c:["general"], ex:"Run the built-in benchmark where available."},
  {k:"-nojoy", c:["general"], ex:"Disable joystick/gamepad input."},
  {k:"-nosteamcontroller", c:["general"], cr:true, ex:"Disable the Steam Input API layer."},
  {k:"-timedemo <demo>", c:["general"], ex:"Play a demo as fast as possible for benchmarking."},

  /* ---- Source 1 ---- */
  {k:"+cl_forcepreload 1", c:["engine"], e:["Source 1"], ex:"Preload models/textures; can make loading slower but removes hitches."},
  {k:"-noforcemparms", c:["engine"], e:["Source 1"], ex:"Use the OS mouse parameters."},
  {k:"-noforcemaccel", c:["engine"], e:["Source 1"], ex:"Disable in-game mouse acceleration."},
  {k:"-noforcemspd", c:["engine"], e:["Source 1"], ex:"Use the OS mouse speed."},
  {k:"-useforcedmparms", c:["engine"], e:["Source 1"], ex:"Allow custom mouse accel via m_yaw / m_pitch."},
  {k:"-nohltv", c:["engine"], e:["Source 1"], ex:"Disable SourceTV / Half-Life TV."},
  {k:"-nod3d9ex", c:["engine"], e:["Source 1"], ex:"Disable D3D9Ex (compat with old drivers and tools)."},
  {k:"-heapsize <bytes>", c:["engine"], e:["Source 1"], ex:"Manual heap size, e.g. 4194304 for 4 GB on 32-bit titles."},
  {k:"+mat_queue_mode 2", c:["engine"], e:["Source 1"], ex:"Force multithreaded rendering."},
  {k:"+r_dynamic 0", c:["engine"], e:["Source 1"], ex:"Disable dynamic lighting (performance gain, visual loss)."},
  {k:"-lv", c:["engine"], e:["Source 1"], ex:"Low-violence mode where supported."},
  {k:"-tickrate <value>", c:["engine"], e:["Source 1"], ex:"Default listen-server tick rate, e.g. 128."},
  {k:"-dxlevel 70", c:["engine"], e:["Source 1"], ex:"Force the DX7 renderer."},
  {k:"-dxlevel 80", c:["engine"], e:["Source 1"], ex:"Force the DX8 renderer."},
  {k:"-dxlevel 81", c:["engine"], e:["Source 1"], ex:"Force the DX8.1 renderer."},
  {k:"-dxlevel 90", c:["engine"], e:["Source 1"], ex:"Force the DX9 renderer."},
  {k:"-dxlevel 95", c:["engine"], e:["Source 1"], ex:"Force the DX9 variant where supported."},
  {k:"-dxlevel 100", c:["engine"], e:["Source 1"], ex:"DX10 for certain ports/mods only."},
  {k:"-dxlevel 110", c:["engine"], e:["Source 1"], ex:"DX11 for certain ports/mods only."},

  /* ---- Source 2 ---- */
  {k:"-vulkan", c:["engine"], e:["Source 2","Unreal"], ex:"Use the Vulkan renderer (Source 2 and many UE titles)."},
  {k:"-dx11", c:["engine"], e:["Source 2","Unreal"], ex:"Use the D3D11 renderer (Source 2 and many UE titles)."},

  /* ---- Unreal ---- */
  {k:"-USEALLAVAILABLECORES", c:["engine"], e:["Unreal"], ex:"Use all available CPU cores."},
  {k:"-sm4", c:["engine"], e:["Unreal"], ex:"Force Shader Model 4 (older GPUs)."},
  {k:"-sm5", c:["engine"], e:["Unreal"], ex:"Force Shader Model 5."},
  {k:"-d3d9", c:["engine"], e:["Unreal"], ex:"Force Direct3D 9 (UE3 and some UE4 builds)."},
  {k:"-d3d10", c:["engine"], e:["Unreal"], ex:"Force Direct3D 10."},
  {k:"-d3d11", c:["engine"], e:["Unreal"], ex:"Force Direct3D 11."},
  {k:"-dx12", c:["engine"], e:["Unreal"], ex:"Force DirectX 12."},
  {k:"-opengl", c:["engine"], e:["Unreal"], ex:"Use the OpenGL renderer."},
  {k:"-vulkanvalidationlayers", c:["engine","tool"], e:["Unreal"], ex:"Enable Vulkan validation layers (debug; very slow)."},
  {k:"-renderthreaded", c:["engine"], e:["Unreal"], cr:true, ex:"Enable threaded rendering."},
  {k:"-NoVSync", c:["engine"], e:["Unreal"], ex:"Disable VSync."},
  {k:"-ResX=<w> -ResY=<h>", c:["engine"], e:["Unreal"], ex:"Set resolution, e.g. -ResX=1920 -ResY=1080."},
  {k:"-WINDOWED", c:["engine"], e:["Unreal"], ex:"Force windowed mode."},
  {k:"-NoVerifyGC", c:["engine"], e:["Unreal"], cr:true, ex:"Disable garbage-collector verification (debug)."},
  {k:"-nomansky", c:["engine"], e:["Unreal"], ex:"Disable sky rendering (debug/testing)."},
  {k:"-notexturestreaming", c:["engine"], e:["Unreal"], ex:"Disable texture streaming: less pop-in, much more VRAM."},
  {k:"-ForceRes", c:["engine"], e:["Unreal"], ex:"Force the requested resolution even if the game thinks it is unsupported."},

  /* ---- Unity ---- */
  {k:"-screen-width <n>", c:["engine"], e:["Unity"], ex:"Set window width."},
  {k:"-screen-height <n>", c:["engine"], e:["Unity"], ex:"Set window height."},
  {k:"-screen-fullscreen 0/1", c:["engine"], e:["Unity"], ex:"Windowed (0) or fullscreen (1)."},
  {k:"-popupwindow", c:["engine"], e:["Unity"], ex:"Borderless windowed mode."},
  {k:"-force-d3d11", c:["engine"], e:["Unity"], ex:"Force the DX11 backend."},
  {k:"-force-d3d12", c:["engine"], e:["Unity"], ex:"Force the DX12 backend."},
  {k:"-force-vulkan", c:["engine"], e:["Unity"], ex:"Force the Vulkan backend."},
  {k:"-force-glcore", c:["engine"], e:["Unity"], ex:"Use the OpenGL Core profile."},
  {k:"-force-wayland", c:["engine"], e:["Unity"], ex:"Enable Unity's experimental native Wayland support on Linux players."},
  {k:"-window-mode <exclusive|borderless>", c:["engine"], e:["Unity"], ex:"Override Unity's fullscreen window mode (Windows only)."},
  {k:"-force-device-index <n>", c:["engine"], e:["Unity"], ex:"Select the GPU by index for D3D11/D3D12/Metal/Vulkan (not OpenGL)."},
  {k:"-batchmode", c:["engine"], e:["Unity"], ex:"Headless mode, no window (servers/dedicated)."},
  {k:"-nographics", c:["engine"], e:["Unity"], ex:"Disable rendering entirely (server mode)."},
  {k:"-single-instance", c:["engine"], e:["Unity"], ex:"Refuse a second concurrent instance of the game."},

  /* ---- Rockstar ---- */
  {k:"-nologo", c:["engine"], e:["Rockstar"], ex:"Skip the Rockstar logo videos (GTA V)."},
  {k:"-scOfflineOnly", c:["engine"], e:["Rockstar"], ex:"Start Social Club in offline mode."},
  {k:"-ignoreDifferentVideoCard", c:["engine"], e:["Rockstar"], ex:"Ignore the saved GPU and re-detect it (fixes GPU-change launch errors)."},

  /* ---- Proton / Linux env ---- */
  {k:"PROTON_LOG=1", c:["proton","tool"], ex:"Write a Proton log to your home directory."},
  {k:"PROTON_ENABLE_WAYLAND=1", c:["proton"], ex:"Use Wine's native Wayland driver instead of XWayland. Experimental; needs a Wayland session and a current driver. The driver/NVAPI Reflex sleep path does not work under it."},
  {k:"PROTON_USE_NTSYNC=1", c:["proton"], ex:"Legacy opt-in for the kernel NTSYNC driver. Newer Proton/GE enable NTSYNC automatically when /dev/ntsync exists; needs kernel 6.14+ (or patched)."},
  {k:"PROTON_NO_NTSYNC=1", c:["proton"], ex:"Disable NTSYNC and fall back to fsync/esync. Debugging switch for sync regressions."},
  {k:"PROTON_USE_WOW64=1", c:["proton"], ex:"Use the new WoW64 mode (no 32-bit host libraries); helps some 32-bit titles with NTSYNC."},
  {k:"PROTON_USE_WINED3D=1", c:["proton"], ex:"Use WineD3D (OpenGL) instead of DXVK/vkd3d. Compatibility fallback, much slower."},
  {k:"PROTON_ENABLE_NVAPI=1", c:["proton","nvidia"], ex:"Expose NVAPI to the game: DLSS, DLSS Frame Generation, Reflex, NVIDIA queries."},
  {k:"PROTON_VKD3D_HEAP=1", c:["proton","nvidia"], ex:"Opt into vkd3d-proton's experimental descriptor-heap path (VK_EXT_descriptor_heap). Needs a Proton-CachyOS/GE build plus a very new NVIDIA driver."},
  {k:"PROTON_HIDE_NVIDIA_GPU=0", c:["proton","nvidia"], ex:"Keep the NVIDIA GPU visible to the game (some titles hide it)."},
  {k:"PROTON_ENABLE_HDR=1", c:["proton"], ex:"Legacy HDR override. HDR is auto-detected in current GE-Proton; 1 no longer forces it on Wayland (use PROTON_FORCE_HDR), 0 disables HDR reporting."},
  {k:"PROTON_FORCE_HDR=1", c:["proton"], ex:"Report HDR on every native Wine Wayland output even if the compositor says SDR (KDE with SDR brightness at peak, Hyprland auto-HDR). Can hang real SDR monitors."},
  {k:"PROTON_FSR4_UPGRADE=1", c:["proton","amd"], ex:"Download and swap in a newer amdxcffx64.dll (FSR 4) for games shipping FSR 3.1. GE-Proton feature; needs RDNA3+ and driver support."},
  {k:"PROTON_DLSS_UPGRADE=1", c:["proton","nvidia"], ex:"Download and use a newer nvngx_dlss(d|g).dll. Accepts a version, e.g. PROTON_DLSS_UPGRADE=310.2."},
  {k:"PROTON_XESS_UPGRADE=1", c:["proton","tool"], ex:"Download and use a newer Intel XeSS DLL where the game ships XeSS."},
  {k:"PROTON_FSR4_INDICATOR=1", c:["proton","tool"], ex:"Show the FSR upscaling/frame-generation watermark to confirm FSR 4 is actually engaged."},
  {k:"PROTON_DLSS_INDICATOR=1", c:["proton","nvidia","tool"], ex:"Show the DLSS version/render-preset indicator through dxvk-nvapi."},
  {k:"WINE_FULLSCREEN_FSR=1", c:["proton","amd"], ex:"GE-Proton fullscreen FSR upscaling for Vulkan games (DXVK/vkd3d) that lack FSR of their own."},
  {k:"WINE_FULLSCREEN_FSR_STRENGTH=2", c:["proton","amd"], ex:"FSR sharpening strength 0-5 for WINE_FULLSCREEN_FSR; 0 is sharpest, GE defaults to 2."},

  /* ---- Vulkan / graphics env ---- */
  {k:"MANGOHUD=1", c:["tool"], ex:"Enable the MangoHud overlay (FPS, frametimes, GPU/CPU load)."},
  {k:"MANGOHUD_CONFIG=fps,frametime,gpu_temp,cpu_temp", c:["tool"], ex:"Choose which stats MangoHud shows."},
  {k:"DXVK_HUD=1", c:["proton","tool"], ex:"DXVK overlay: API, FPS, frametimes."},
  {k:"DXVK_CONFIG=\"dxgi.maxFrameRate = 144\"", c:["proton"], ex:"Set DXVK options through the environment; here a 144 fps cap (0 = uncapped)."},
  {k:"DXVK_LOG_LEVEL=info", c:["proton"], ex:"DXVK logging verbosity (none|error|warn|info|debug)."},
  {k:"DXVK_FILTER_DEVICE_NAME=<gpu>", c:["proton"], ex:"Force DXVK onto the Vulkan device whose name contains this substring (multi-GPU); read names from vulkaninfo."},
  {k:"VKD3D_CONFIG=dxr", c:["proton"], ex:"Force DXR on even where vkd3d-proton considers it unsafe; DXR is normally enabled automatically."},
  {k:"VKD3D_CONFIG=descriptor_heap", c:["proton","nvidia"], ex:"CachyOS/GE fork only: use the descriptor-heap path; pair with PROTON_VKD3D_HEAP=1."},
  {k:"VKD3D_DEBUG=warn", c:["proton"], ex:"vkd3d-proton log level (none|err|info|fixme|warn|trace)."},
  {k:"VKD3D_FRAME_RATE=144", c:["proton"], ex:"Cap vkd3d-proton's frame rate; 0 removes the cap."},
  {k:"VKD3D_SWAPCHAIN_PRESENT_MODE=mailbox", c:["proton"], ex:"Force a Vulkan present mode for D3D12: IMMEDIATE, MAILBOX, FIFO, FIFO_RELAXED or FIFO_LATEST_READY."},
  {k:"VKD3D_VULKAN_DEVICE=0", c:["proton"], ex:"Force vkd3d-proton onto a specific Vulkan device index on multi-GPU systems."},
  {k:"VK_LOADER_DEBUG=all", c:["proton","tool"], ex:"Verbose Vulkan loader diagnostics."},
  {k:"VK_INSTANCE_LAYERS=VK_LAYER_KHRONOS_validation", c:["proton","tool"], ex:"Enable the Khronos validation layers (debug; slow)."},
  {k:"VK_ICD_FILENAMES=/path/to/icd.json", c:["proton"], ex:"Override which Vulkan driver JSON gets loaded."},
  {k:"VK_DEVICE_SELECT_DEVICE_INDEX=0", c:["proton"], ex:"Pick a GPU via the device-select layer index."},
  {k:"vblank_mode=0", c:["proton"], ex:"Disable GL/Vulkan frame-sync waiting (uncapped, may tear)."},
  {k:"MESA_VK_WSI_PRESENT_MODE=mailbox", c:["amd"], ex:"Force a Mesa Vulkan present mode (fifo/relaxed/mailbox/immediate). Applied by the driver, so it overrides the game's and MangoHud/GOverlay vsync choice."},
  {k:"DRI_PRIME=1", c:["amd"], ex:"Render on the discrete AMD GPU on hybrid laptops."},
  {k:"LOW_LATENCY_LAYER=1", c:["nvidia","amd","tool"], ex:"Opt in to low_latency_layer, the hardware-agnostic Vulkan latency layer (Reflex/Anti-Lag style). Must be installed."},
  {k:"LOW_LATENCY_LAYER_REFLEX=1", c:["nvidia","tool"], ex:"Make low_latency_layer expose VK_NV_low_latency2 (Reflex) instead of VK_AMD_anti_lag. Needed on NVIDIA, where games look for Reflex."},

  /* ---- NVIDIA ---- */
  {k:"__GL_THREADED_OPTIMIZATIONS=1", c:["nvidia"], ex:"Let the NVIDIA GL driver use worker threads."},
  {k:"__GL_SHADER_DISK_CACHE=1", c:["nvidia"], ex:"Enable the NVIDIA GL shader disk cache."},
  {k:"__GL_SHADER_DISK_CACHE_SKIP_CLEANUP=1", c:["nvidia"], ex:"Keep the shader cache from being trimmed."},
  {k:"__GL_MaxFramesAllowed=1", c:["nvidia"], ex:"Limit pre-rendered GL frames to 1: lower latency, possible stutter."},
  {k:"__GLX_VENDOR_LIBRARY_NAME=nvidia", c:["nvidia"], ex:"Force the NVIDIA GLX vendor library on hybrid/PRIME systems."},
  {k:"__NV_PRIME_RENDER_OFFLOAD=1", c:["nvidia"], ex:"Render on the NVIDIA GPU in a PRIME offload setup."},
  {k:"__VK_LAYER_NV_optimus=NVIDIA_only", c:["nvidia"], ex:"Force Vulkan to use only the NVIDIA GPU (Optimus/PRIME)."},

  /* ---- AMD ---- */
  {k:"RADV_PERFTEST=aco", c:["amd"], ex:"Use the ACO shader compiler. Legacy: ACO is already the default since Mesa 22."},
  {k:"RADV_PERFTEST=gpl", c:["amd"], ex:"Enable graphics pipeline library for faster pipeline creation."},
  {k:"RADV_TEX_ANISO=16", c:["amd"], ex:"Force 16x anisotropic filtering in RADV."},
  {k:"AMD_VULKAN_ICD=RADV", c:["amd"], ex:"Select RADV (Mesa) as the AMD Vulkan driver."},
  {k:"AMD_VULKAN_ICD=AMDVLK", c:["amd"], ex:"Select AMDVLK instead of RADV; RADV_* variables are then ignored."},

  /* ---- Wrappers / tools ---- */
  {k:"gamemoderun", c:["tool"], ex:"Wrapper: run through Feral GameMode (CPU governor, priority, scheduler tweaks)."},
  {k:"gamescope -W <width> -H <height> -r <rate> -f", c:["tool"], ex:"Wrapper: run the game inside gamescope, a Wayland micro-compositor. The builder adds the required -- before %command%."}
];

var USE_WHEN = {
  /* General */
  "-novid": {u:"Use on every repeat launch when logo/intro videos waste 10-60 seconds, or when troubleshooting startup.", p:["-nosplash","-console"]},
  "-high": {u:"Use on a desktop where the game is CPU-bound and nothing else needs CPU time; skip it on laptops on battery.", p:["-USEALLAVAILABLECORES","gamemoderun"]},
  "-fullscreen": {u:"Use when you want exclusive fullscreen for VRR/G-Sync or the lowest input latency, and the game defaults to windowed.", p:["-refresh <rate>","MANGOHUD=1"]},
  "-windowed": {u:"Use when you alt-tab constantly, stream, or the game crashes entering fullscreen.", p:["-noborder","-w <width>","-h <height>"]},
  "-noborder": {u:"Use with -windowed for a borderless window that still alt-tabs instantly on multi-monitor setups.", p:["-windowed","-w <width>"]},
  "-borderless": {u:"Use on engines with a real borderless mode when you want full-screen size but instant alt-tab.", p:["-fullscreen","-refresh <rate>"]},
  "-w <width>": {u:"Use when the engine ignores in-game resolution or starts at a wrong window size.", p:["-h <height>","-windowed"]},
  "-h <height>": {u:"Use together with -w when the game refuses the resolution you picked.", p:["-w <width>","-windowed"]},
  "-refresh <rate>": {u:"Use when a 144/165/240 Hz monitor still runs the game at 60 Hz.", p:["-fullscreen","MANGOHUD=1"]},
  "-freq <rate>": {u:"Use as the fallback refresh flag on engines that ignore -refresh.", p:["-refresh <rate>"]},
  "-threads <n>": {u:"Use on hybrid CPUs or old games that spawn too many threads and stutter; start with physical core count.", p:["-USEALLAVAILABLECORES"]},
  "-autoconfig": {u:"Use after a GPU/driver change, a corrupted config, or a black-screen first launch.", p:["-safe","-windowed"]},
  "-safe": {u:"Use when the game crashes immediately at startup with your normal settings.", p:["-autoconfig","-windowed"]},
  "-console": {u:"Use while tweaking cvars, testing mods, or reading engine errors in-game.", p:["-dev"]},
  "-nosound": {u:"Use for dedicated servers, broken audio devices, or isolating an audio-driver crash.", p:["-nojoy"]},
  "-language <code>": {u:"Use when the game ignores the Steam language or a patch forced the wrong locale.", p:[]},
  "-noasync": {u:"Use only to diagnose hitching or corrupt loads that look async-loading related; it usually increases load times.", p:["PROTON_LOG=1"]},
  "-nosplash": {u:"Use on non-Valve games whose own splash screens still appear after -novid.", p:["-novid"]},
  "-nolog": {u:"Use when the game writes huge logs and you do not need support diagnostics.", p:[]},
  "-dev": {u:"Use when enabling developer menus, logging, or mod tooling that the game hides by default.", p:["-console"]},
  "-benchmark": {u:"Use when comparing settings or drivers; run it paired with the overlay so you can read the numbers.", p:["MANGOHUD=1","-novid"]},
  "-nojoy": {u:"Use when a controller is double-detected or a wheel/hotas interferes with mouse and keyboard.", p:["-nosteamcontroller"]},
  "-nosteamcontroller": {u:"Use when Steam Input causes double input, wrong glyphs, or a controller that the game handles natively.", p:["-nojoy"]},
  "-timedemo <demo>": {u:"Use for repeatable old-engine benchmarks; not useful for normal play.", p:["-benchmark"]},

  /* Source 1 */
  "+cl_forcepreload 1": {u:"Use on older Source titles with slow disks and texture hitching; on fast NVMe it mostly lengthens loading.", p:["+mat_queue_mode 2"]},
  "-noforcemparms": {u:"Use when mouse feel changes between the desktop and the game.", p:["-noforcemaccel","-noforcemspd"]},
  "-noforcemaccel": {u:"Use for raw aim when the game applies its own acceleration on top of the OS setting.", p:["-noforcemparms"]},
  "-noforcemspd": {u:"Use when the game ignores your OS pointer speed and feels too fast or too slow.", p:["-noforcemparms"]},
  "-useforcedmparms": {u:"Use only if you deliberately want custom accel values via m_yaw/m_pitch (old competitive setups).", p:[]},
  "-nohltv": {u:"Use to free the spectator/SourceTV overhead on low-end machines.", p:[]},
  "-nod3d9ex": {u:"Use on old drivers or overlay/hook tools that break with D3D9Ex.", p:["-dxlevel 90"]},
  "-heapsize <bytes>": {u:"Use on 32-bit Source games that crash with out-of-memory errors on big maps/mods.", p:[]},
  "+mat_queue_mode 2": {u:"Use on multi-core CPUs when Source stutters with single-threaded rendering.", p:["-threads <n>","+cl_forcepreload 1"]},
  "+r_dynamic 0": {u:"Use on very old GPUs or for competitive visibility; it removes dynamic lighting.", p:["-dxlevel 90"]},
  "-lv": {u:"Use only where the low-violence build is required by your region or account.", p:[]},
  "-tickrate <value>": {u:"Use when hosting a listen server and clients need a higher tick rate.", p:[]},
  "-dxlevel 70": {u:"Use only for very old GPUs/GL wrappers; modern Source titles may refuse to start.", p:["-windowed"]},
  "-dxlevel 80": {u:"Use for DX8-era hardware where DX9 rendering is broken.", p:["-windowed"]},
  "-dxlevel 81": {u:"Use as a DX8.1 fallback when DX9 flickers or crashes.", p:["-windowed"]},
  "-dxlevel 90": {u:"Use when Source defaults to a broken renderer or an overlay only works on DX9.", p:["-nod3d9ex"]},
  "-dxlevel 95": {u:"Use only for the few Source builds that expose the DX9.5 path.", p:["-autoconfig"]},
  "-dxlevel 100": {u:"Use only with ports/mods that explicitly support DX10; retail Source ignores it.", p:[]},
  "-dxlevel 110": {u:"Use only with ports/mods that explicitly support DX11.", p:[]},

  /* Source 2 / Unreal / Unity renderers */
  "-vulkan": {u:"Use on Linux when the native Vulkan renderer is faster or the D3D path stutters through Proton.", p:["LOW_LATENCY_LAYER=1","MANGOHUD=1"]},
  "-dx11": {u:"Use when DX12 or Vulkan crashes on your driver and you want the stable path.", p:["-NoVSync"]},
  "-USEALLAVAILABLECORES": {u:"Use on CPU-bound Unreal games on 6+ core CPUs; it can hurt on few-core/thermal-limited laptops.", p:["-threads <n>"]},
  "-sm4": {u:"Use for GPUs that lack Shader Model 5 and fail to start UE4 titles.", p:["-d3d11"]},
  "-sm5": {u:"Use when a UE game wrongly selects a lower shader model and looks broken.", p:["-dx11"]},
  "-d3d9": {u:"Use for UE3 titles or very old hardware where DX10/11 paths crash.", p:["-windowed"]},
  "-d3d10": {u:"Use only for period-correct DX10 hardware; nearly obsolete otherwise.", p:[]},
  "-d3d11": {u:"Use to avoid a broken DX12 implementation while keeping modern visuals.", p:["-NoVSync"]},
  "-dx12": {u:"Use when the UE title runs better on DX12, or to enable DXR/DLSS through vkd3d.", p:["PROTON_VKD3D_HEAP=1","VKD3D_CONFIG=dxr"]},
  "-opengl": {u:"Use as a compatibility/debug path when both D3D and Vulkan fail.", p:[]},
  "-vulkanvalidationlayers": {u:"Use only while developing or filing a driver bug; it is extremely slow.", p:["-vulkan"]},
  "-renderthreaded": {u:"Use on multi-core CPUs when a UE game stutters despite low GPU load.", p:["-USEALLAVAILABLECORES"]},
  "-NoVSync": {u:"Use when you want uncapped frames/tearing or are testing latency with an external limiter. Also set vsync Off in-game so both toggles agree.", p:["-fullscreen","LOW_LATENCY_LAYER=1"]},
  "-ResX=<w> -ResY=<h>": {u:"Use when a UE game ignores in-game resolution or starts at 720p on a 4K display.", p:["-WINDOWED","-ForceRes"]},
  "-WINDOWED": {u:"Use for quick alt-tabbing on UE titles that only offer fullscreen in-game.", p:["-ResX=<w> -ResY=<h>"]},
  "-NoVerifyGC": {u:"Use only while debugging crash reports; it disables a safety check and slows the game.", p:["-nolog"]},
  "-nomansky": {u:"Use for benchmarking or on very weak GPUs; it removes the sky and breaks visuals.", p:[]},
  "-notexturestreaming": {u:"Use on NVMe + lots of VRAM when texture pop-in bothers you; expect a large VRAM increase.", p:["-sm5"]},
  "-ForceRes": {u:"Use when the game rejects a resolution it considers unsupported (ultrawide, custom).", p:["-ResX=<w> -ResY=<h>"]},
  "-screen-width <n>": {u:"Use when a Unity game ignores the configured window size.", p:["-screen-height <n>","-popupwindow"]},
  "-screen-height <n>": {u:"Use together with -screen-width on Unity titles with a broken size setting.", p:["-screen-width <n>","-popupwindow"]},
  "-screen-fullscreen 0/1": {u:"Use to force Unity into windowed (0) or fullscreen (1) when its own toggle does nothing.", p:["-popupwindow"]},
  "-popupwindow": {u:"Use for borderless Unity games so alt-tab does not minimize or reset the resolution.", p:["-screen-width <n>","-screen-height <n>"]},
  "-force-d3d11": {u:"Use when Unity picks a broken DX12 or Vulkan backend.", p:["-NoVSync"]},
  "-force-d3d12": {u:"Use when Unity's DX12 path is faster and your driver handles it; pair with vkd3d tuning on Linux.", p:["PROTON_VKD3D_HEAP=1"]},
  "-force-vulkan": {u:"Use on Linux/Steam Deck when the Unity Vulkan backend outperforms D3D-through-Proton.", p:["MANGOHUD=1"]},
  "-force-glcore": {u:"Use when a Unity build needs the OpenGL Core profile (mostly Linux/macOS).", p:[]},
  "-force-wayland": {u:"Use to test Unity's native Wayland path on Linux; still experimental, verify HDR/VRR behaviour.", p:["MANGOHUD=1"]},
  "-window-mode <exclusive|borderless>": {u:"Use when a Unity game ignores the in-game fullscreen mode on Windows (no effect under Proton's Wayland driver).", p:["-screen-fullscreen 0/1"]},
  "-force-device-index <n>": {u:"Use on multi-GPU laptops when Unity picks the iGPU; indexes come from the Vulkan/D3D device list.", p:["DRI_PRIME=1"]},

  /* Headless / Rockstar */
  "-batchmode": {u:"Use for dedicated servers or automated tests that must run without a window.", p:["-nographics"]},
  "-nographics": {u:"Use for headless servers; the game will not render anything.", p:["-batchmode"]},
  "-single-instance": {u:"Use when a launcher or a second click spawns duplicate game processes.", p:[]},
  "-nologo": {u:"Use on GTA V to skip the Rockstar logo sequence.", p:["-novid","-scOfflineOnly"]},
  "-scOfflineOnly": {u:"Use when Social Club login stalls or you only play single-player.", p:["-nologo"]},
  "-ignoreDifferentVideoCard": {u:"Use right after swapping GPUs, when GTA V refuses to start or resets settings.", p:["-autoconfig"]},

  /* Proton */
  "PROTON_LOG=1": {u:"Use when a Proton game crashes or misbehaves and you need a log to report the bug.", p:["DXVK_LOG_LEVEL=info"]},
  "PROTON_ENABLE_WAYLAND=1": {u:"Use on a Wayland desktop when you want native presentation, HDR, or per-monitor DPI. Driver-level Reflex sleep doesn't work here — use the low-latency layer for latency control instead.", p:["PROTON_ENABLE_HDR=1","MANGOHUD=1"]},
  "PROTON_USE_NTSYNC=1": {u:"Use on older Proton/GE builds to opt in early; current builds enable NTSYNC automatically on kernel 6.14+ with /dev/ntsync.", p:["PROTON_USE_WOW64=1"]},
  "PROTON_NO_NTSYNC=1": {u:"Use to A/B test or work around an NTSYNC regression; Proton falls back to fsync/esync.", p:["PROTON_USE_WOW64=1"]},
  "PROTON_USE_WOW64=1": {u:"Use for 32-bit games that fail to launch or misbehave, especially alongside NTSYNC.", p:["PROTON_USE_NTSYNC=1"]},
  "PROTON_USE_WINED3D=1": {u:"Use only when DXVK/vkd3d crashes or the game is OpenGL/D3D9-only on very old hardware.", p:[]},
  "PROTON_ENABLE_NVAPI=1": {u:"Use on NVIDIA when a game's DLSS/Reflex menu stays greyed out or the GPU is misdetected.", p:["PROTON_VKD3D_HEAP=1","-dx12"]},
  "PROTON_VKD3D_HEAP=1": {u:"Use on very new NVIDIA drivers with DX12 crashes, stutter, or Xid 109 hard locks, and only with a CachyOS/GE build.", p:["PROTON_ENABLE_NVAPI=1","VKD3D_CONFIG=descriptor_heap"]},
  "PROTON_HIDE_NVIDIA_GPU=0": {u:"Use when a game or launcher does not see the NVIDIA GPU and falls back to software/other GPU.", p:["PROTON_ENABLE_NVAPI=1"]},
  "PROTON_ENABLE_HDR=1": {u:"Legacy switch: current GE-Proton auto-detects HDR. Set to 0 to force HDR off, or use PROTON_FORCE_HDR when the compositor reports SDR.", p:["PROTON_FORCE_HDR=1","PROTON_ENABLE_WAYLAND=1"]},
  "PROTON_FORCE_HDR=1": {u:"Use on native Wayland when KDE reports SDR (SDR brightness at peak) or Hyprland auto-HDR; per game only, can hang real SDR monitors.", p:["PROTON_ENABLE_WAYLAND=1"]},
  "PROTON_FSR4_UPGRADE=1": {u:"Use in FSR 3.1 games on RDNA3+ to swap in the newer FSR 4 DLL; GE-Proton only, and not for FSR 2/3.0-only titles.", p:["PROTON_FSR4_INDICATOR=1"]},
  "PROTON_DLSS_UPGRADE=1": {u:"Use on NVIDIA when a game ships an older DLSS DLL; add a version like =310.2 only if you need a specific one.", p:["PROTON_DLSS_INDICATOR=1","PROTON_ENABLE_NVAPI=1"]},
  "PROTON_XESS_UPGRADE=1": {u:"Use on XeSS titles to pull a newer Intel XeSS DLL; works on any GPU that runs XeSS.", p:[]},
  "PROTON_FSR4_INDICATOR=1": {u:"Use to confirm FSR 4 upscaling/frame-gen is actually running (corner watermark).", p:["PROTON_FSR4_UPGRADE=1"]},
  "PROTON_DLSS_INDICATOR=1": {u:"Use to see which DLSS version and render preset the game is really using.", p:["PROTON_DLSS_UPGRADE=1"]},
  "WINE_FULLSCREEN_FSR=1": {u:"Use in GE-Proton to upscale a Vulkan game that has no FSR of its own; fullscreen only.", p:["WINE_FULLSCREEN_FSR_STRENGTH=2"]},
  "WINE_FULLSCREEN_FSR_STRENGTH=2": {u:"Use with WINE_FULLSCREEN_FSR to tune sharpening (0 sharpest, 5 softest; 2 is the GE default).", p:["WINE_FULLSCREEN_FSR=1"]},

  /* Vulkan / DXVK / vkd3d */
  "MANGOHUD=1": {u:"Use whenever you are measuring changes, checking the real renderer, or watching temps and clocks.", p:["MANGOHUD_CONFIG=fps,frametime,gpu_temp,cpu_temp"]},
  "MANGOHUD_CONFIG=fps,frametime,gpu_temp,cpu_temp": {u:"Use to trim the overlay to the stats you actually read, or to add battery/VRAM fields.", p:["MANGOHUD=1"]},
  "DXVK_HUD=1": {u:"Use to confirm D3D is going through DXVK and to see API/frametime numbers without MangoHud.", p:["DXVK_LOG_LEVEL=info"]},
  "DXVK_CONFIG=\"dxgi.maxFrameRate = 144\"": {u:"Use to cap frames below the monitor rate for steadier frametimes, or stop a menu running at 1000 fps. Any DXVK option works here.", p:["MANGOHUD=1"]},
  "DXVK_LOG_LEVEL=info": {u:"Use while diagnosing DXVK shader/driver errors; leave it off for normal play.", p:["PROTON_LOG=1"]},
  "DXVK_FILTER_DEVICE_NAME=<gpu>": {u:"Use on multi-GPU systems when DXVK picks the wrong Vulkan device; match a substring of the vulkaninfo device name.", p:["VK_DEVICE_SELECT_DEVICE_INDEX=0"]},
  "VKD3D_CONFIG=dxr": {u:"Use only when a DX12 game hides ray tracing because vkd3d considers DXR unsafe; normally auto-enabled.", p:["-dx12","PROTON_ENABLE_NVAPI=1"]},
  "VKD3D_CONFIG=descriptor_heap": {u:"Use together with PROTON_VKD3D_HEAP on the CachyOS/GE fork that separates the two switches.", p:["PROTON_VKD3D_HEAP=1"]},
  "VKD3D_DEBUG=warn": {u:"Use when DX12 games crash and you need vkd3d-proton diagnostics.", p:["PROTON_LOG=1"]},
  "VKD3D_FRAME_RATE=144": {u:"Use to cap DX12 frames without an external limiter; 0 uncaps.", p:["MANGOHUD=1"]},
  "VKD3D_SWAPCHAIN_PRESENT_MODE=mailbox": {u:"Use when a game picks a bad present mode; mailbox is low latency, FIFO is vsync. Set vsync to Off in-game so the two do not fight.", p:["VKD3D_FRAME_RATE=144"]},
  "VKD3D_VULKAN_DEVICE=0": {u:"Use on multi-GPU systems to force which Vulkan device vkd3d opens.", p:["DXVK_FILTER_DEVICE_NAME=<gpu>"]},
  "VK_LOADER_DEBUG=all": {u:"Use when layers, ICDs, or device selection misbehave and you need loader output.", p:["VK_INSTANCE_LAYERS=VK_LAYER_KHRONOS_validation"]},
  "VK_INSTANCE_LAYERS=VK_LAYER_KHRONOS_validation": {u:"Use only for layer/driver development or bug reports; expect single-digit FPS.", p:["VK_LOADER_DEBUG=all"]},
  "VK_ICD_FILENAMES=/path/to/icd.json": {u:"Use to pin one Vulkan driver on systems with several ICDs installed.", p:["VK_DEVICE_SELECT_DEVICE_INDEX=0"]},
  "VK_DEVICE_SELECT_DEVICE_INDEX=0": {u:"Use on multi-GPU systems to force which Vulkan device the game opens.", p:["VK_ICD_FILENAMES=/path/to/icd.json"]},
  "vblank_mode=0": {u:"Use when testing uncapped performance or pairing with an external frame limiter; it can tear. Turn vsync Off in-game first, or the setting is ignored.", p:["-fullscreen","__GL_MaxFramesAllowed=1"]},
  "MESA_VK_WSI_PRESENT_MODE=mailbox": {u:"Use on Mesa when you want one present mode globally. Set V-Sync to Off in-game and either match MangoHud's vsync in GOverlay (vsync=2) or unset it — this variable wins at the driver level, so a conflicting in-game/GOverlay vsync silently stops applying.", p:["LOW_LATENCY_LAYER=1"]},
  "DRI_PRIME=1": {u:"Use on hybrid AMD laptops when the game renders on the iGPU instead of the dGPU.", p:["-force-device-index <n>"]},
  "LOW_LATENCY_LAYER=1": {u:"Use for competitive shooters when the game/GPU lacks working Reflex or Anti-Lag. It works under native Wayland (tested on KDE + direct scanout); the 0.0 ms Reflex bug is the driver path, not this layer. Off for single-player.", p:["LOW_LATENCY_LAYER_REFLEX=1","MANGOHUD=1","-NoVSync"]},
  "LOW_LATENCY_LAYER_REFLEX=1": {u:"Use on NVIDIA so the layer reports Reflex (VK_NV_low_latency2) instead of Anti-Lag 2. If the in-game Reflex option still doesn't appear, add DXVK_CONFIG with dxgi.hideAmdGpu = True or PROTON_FORCE_NVAPI=1.", p:["LOW_LATENCY_LAYER=1","PROTON_ENABLE_NVAPI=1"]},

  /* NVIDIA */
  "__GL_THREADED_OPTIMIZATIONS=1": {u:"Use for CPU-bound OpenGL games where the GL driver is the bottleneck.", p:["__GL_SHADER_DISK_CACHE=1"]},
  "__GL_SHADER_DISK_CACHE=1": {u:"Use to stop OpenGL shader-compile stutter between sessions; mostly for older GL titles.", p:["__GL_SHADER_DISK_CACHE_SKIP_CLEANUP=1"]},
  "__GL_SHADER_DISK_CACHE_SKIP_CLEANUP=1": {u:"Use to keep a large shader cache instead of letting the driver trim it.", p:["__GL_SHADER_DISK_CACHE=1"]},
  "__GL_MaxFramesAllowed=1": {u:"Use for OpenGL games with noticeable input lag; it may stutter if the GPU cannot keep up.", p:["vblank_mode=0"]},
  "__GLX_VENDOR_LIBRARY_NAME=nvidia": {u:"Use on PRIME/hybrid systems when OpenGL picks the wrong vendor library.", p:["__NV_PRIME_RENDER_OFFLOAD=1"]},
  "__NV_PRIME_RENDER_OFFLOAD=1": {u:"Use on NVIDIA Optimus laptops to render on the dGPU while the iGPU drives the display.", p:["__VK_LAYER_NV_optimus=NVIDIA_only","__GLX_VENDOR_LIBRARY_NAME=nvidia"]},
  "__VK_LAYER_NV_optimus=NVIDIA_only": {u:"Use on Optimus laptops when Vulkan enumerates the iGPU first or the game opens the wrong device.", p:["__NV_PRIME_RENDER_OFFLOAD=1"]},

  /* AMD */
  "RADV_PERFTEST=aco": {u:"Use only on old Mesa where ACO was still experimental; modern Mesa ignores or already defaults it.", p:[]},
  "RADV_PERFTEST=gpl": {u:"Use to cut shader/pipeline stutter on RDNA cards; safe to try on any recent Mesa.", p:["MESA_VK_WSI_PRESENT_MODE=mailbox"]},
  "RADV_TEX_ANISO=16": {u:"Use when the game has no anisotropic setting but you want sharp textures at an angle.", p:["RADV_PERFTEST=gpl"]},
  "AMD_VULKAN_ICD=RADV": {u:"Use to make sure the Mesa RADV driver is chosen when AMDVLK is also installed.", p:["RADV_PERFTEST=gpl"]},
  "AMD_VULKAN_ICD=AMDVLK": {u:"Use to test AMDVLK against RADV for a specific game; expect RADV_* tuning to stop working.", p:[]},

  /* Wrappers */
  "gamemoderun": {u:"Use on a desktop for CPU governor/priority help in CPU-bound games; skip it when you need predictable benchmarking.", p:["MANGOHUD=1"]},
  "gamescope -W <width> -H <height> -r <rate> -f": {u:"Use when you want built-in scaling, FSR, a frame limiter, or a reliable fullscreen compositor (common on Steam Deck/HTPC).", p:["MANGOHUD=1","gamemoderun"]}
};

var RENDERERS = {
  "-d3d9":"D3D9", "-d3d10":"D3D10", "-d3d11":"D3D11", "-dx11":"D3D11",
  "-dx12":"D3D12", "-d3d12":"D3D12", "-vulkan":"Vulkan", "-opengl":"OpenGL",
  "-force-d3d11":"D3D11", "-force-d3d12":"D3D12",
  "-force-vulkan":"Vulkan", "-force-glcore":"OpenGL Core"
};
var WINDOW_MODES = {
  "-fullscreen":"fullscreen", "-windowed":"windowed", "-WINDOWED":"windowed",
  "-popupwindow":"borderless", "-screen-fullscreen 0/1":"Unity screen mode"
};
var SYNC_MODES = ["PROTON_USE_NTSYNC=1","PROTON_NO_NTSYNC=1"];

var PAIR_RULES = [
  {a:"PROTON_USE_WINED3D=1", b:"PROTON_ENABLE_NVAPI=1", level:"danger",
   title:"WineD3D cannot use NVAPI",
   msg:"NVAPI is only consumed by DXVK/vkd3d on the Vulkan path. Under WineD3D the game sees no NVIDIA extensions at all."},
  {a:"PROTON_USE_WINED3D=1", b:"PROTON_VKD3D_HEAP=1", level:"danger",
   title:"WineD3D + vkd3d heap",
   msg:"PROTON_VKD3D_HEAP only affects vkd3d-proton, which is bypassed entirely when the game runs through WineD3D."},
  {a:"PROTON_USE_WINED3D=1", b:"VKD3D_CONFIG=descriptor_heap", level:"danger",
   title:"WineD3D + vkd3d config",
   msg:"VKD3D_CONFIG is ignored under WineD3D; remove one of the two."},
  {a:"PROTON_USE_WINED3D=1", b:"VKD3D_CONFIG=dxr", level:"danger",
   title:"WineD3D + DXR",
   msg:"DXR comes from vkd3d-proton; WineD3D cannot expose it. The game will start without ray tracing."},
  {a:"AMD_VULKAN_ICD=RADV", b:"AMD_VULKAN_ICD=AMDVLK", level:"danger",
   title:"Two AMD Vulkan drivers",
   msg:"Both lines set AMD_VULKAN_ICD, so the last one silently wins. Keep only RADV or AMDVLK."},
  {a:"MANGOHUD=1", b:"DXVK_HUD=1", level:"info",
   title:"Two overlays",
   msg:"MangoHud and DXVK_HUD both draw stats and will overlap. Disable one while benchmarking."},
  {a:"-high", b:"gamemoderun", level:"info",
   title:"Two priority mechanisms",
   msg:"GameMode already adjusts scheduling and priority around the process; adding -high is usually redundant but harmless."},
  {a:"-vulkan", b:"PROTON_ENABLE_NVAPI=1", level:"info",
   title:"NVAPI on a Vulkan renderer",
   msg:"NVAPI only affects D3D11/D3D12 titles. If the game is actually running its Vulkan renderer, the flag does nothing."}
];

  OPTIONS.forEach(function (option, index) {
    option.id = index + "::" + option.k;
    option.c = option.c && option.c.length ? option.c : ["general"];
    option.role = option.k.startsWith("-") || option.k.startsWith("+")
      ? "flag"
      : (option.k === "gamemoderun" || option.k.startsWith("gamescope") ? "wrapper" : "env");
  });

  var CAT_LABEL = {};
  CATS.forEach(function (cat) { CAT_LABEL[cat.id] = cat.label; });

  window.LGL_LAUNCH = {
    cats: CATS,
    catLabel: CAT_LABEL,
    options: OPTIONS,
    useWhen: USE_WHEN,
    pairRules: PAIR_RULES,
    renderers: RENDERERS,
    windowModes: WINDOW_MODES,
    syncModes: SYNC_MODES
  };
})();
