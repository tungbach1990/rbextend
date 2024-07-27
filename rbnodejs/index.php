<?php
// Dùng header để xoá dữ liệu resource phía client
// Dùng để fix một số lỗi liên quan đến cached files
// Có thể dùng .htaccess + mod_expires + mod_headers
// askapache.com
header('Clear-Site-Data: "cache","storage","cookies"');
#header('Expires: '.gmdate('D, d M Y H:i:s \G\M\T', time() + (60 * 5))); // 5 mins

?>
<!DOCTYPE html>
<html>

<head>
  <title>JorRO - Ragnarok Online Browser</title>
  <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
  <link rel="icon" type="image/x-icon" href="./favicon.ico">
  <script type="text/javascript" src="api.js"></script>
  <script type="text/javascript">
    function initialize() {
      var ROConfig = {
        // GLOBAL VARIABLES
        type: ROBrowser.TYPE.FRAME,
        target: document.getElementById("robrowser"),
        application: ROBrowser.APP.ONLINE,
        // SERVER CONFIG
        servers: [{
          display: "Original - rAthena Server", // Display name, can be anything
          desc: "roBrowser's - Original rAthena", // Description, can be anything
          address: "ro.choigame247.online", // Must match your game server's
          port: 6900, // Must match your game server's
          langtype: 240, // Must match your game server's
          packetver: 20211103, // Must match your game server's
          //grfList: ['new.grf'],
          remoteClient: "https://ro.choigame247.online/rb/client/",
          renewal: true,
          packetKeys: false, // Packet encryption keys ( not implemented?? )
          socketProxy: "wss://ro.choigame247.online:5999",
          //adminList: [2000000],
          loadLua: true,
          // RefineUI với hiệu ứng hình ảnh refine và button Back/Refine again
          refineui_hasAnimate: true
        }, {
          display: "NewRO - Browser", // Display name, can be anything
          desc: "roBrowser's JorRO - New Style", // Description, can be anything
          address: "thien-phong.com", // Must match your game server's
          port: 16900, // Must match your game server's
          langtype: 240, // Must match your game server's
          packetver: 20211103, // Must match your game server's
          //grfList: ['new.grf'],
          remoteClient: "https://ro.choigame247.online/rb/client/",
          renewal: true,
          packetKeys: false, // Packet encryption keys ( not implemented?? )
          socketProxy: "wss://ro.choigame247.online:5999",
          adminList: [2000000],
          loadLua: true,
          // RefineUI với hiệu ứng hình ảnh refine và button Back/Refine again
          refineui_hasAnimate: true
        }],
        //grfList: ['new.grf'], // TODO: make grfList seperator for server, read first, available to config in servers[]
        remoteClient: "https://ro.choigame247.online/rb/client/", // TODO: make grfList seperator for server, read first, available to config in servers[]
        // OTHER CONFIG - These can be part of the server config as well, thus making them adjustable per server
        skipServerList: false,
        skipIntro: true,
        version: <?php echo date("Ymd.H9"); ?>,

        worldMapSettings: { // Settings for world map.
          episode: 98, // Episode content to show (0-98, eg:14.2, default:98 = latest)
          add: [], // Optional, Array of maps to custom show  (eg: ['rachel', 'ra_fild01'])
          remove: [] // Optional, Array of maps to custom remove (eg: ['alberta', 'pay_fild03'])
        },
        enableCashShop: true, // Enable Cash Shop UI?
        enableBank: true, // Enable Bank UI? (Requires PACKETVER 20130724 above)
        enableMapName: true, // Enable Map Name Banner? (Requires client data (GRF) newer than 2019.06.19)
        enableCheckAttendance: true, // Enable Check Attendance? (Requires PACKETVER 20180307 above)
        loadLua: true, // Enable this option to load LUA tables (currently only item table) from client/System/...

        calculateHash: false,
        hashFiles: ["api.html", "api.js", "Online.js", "ThreadEventHandler.js"],

        /* Plugins */
        plugins: {
          /* Syntax */

          // Simple (no parameters):
          // PluginName: 'Plugin_JS_Path_In_PluginsFolder_Without_Extension',

          // Complex (with configurable parameters):
          // PluginName: { path:'Plugin_JS_Path_In_PluginsFolder_Without_Extension', pars: { param1: <val1>, param2: <val2>, param3: <val3>... } }

          /* Example: */
          // KeyToMove: 'KeyToMove/KeyToMove'
          // IntroMessage: { path:'IntroMessage/IntroMessage', pars: { newsUrl: 'https://yourserver.com/news/news.html' } }
          //UISelectionPlugin: 'UISelectionPlugin/UISelectionPlugin',
          //KeyToMove: 'KeyToMove/KeyToMove',
          //IntroMessage: { path:'IntroMessage/IntroMessage', pars: { newsUrl: '/robrowser/news.php' } },
        },

        /* Custom, "for fun" camera modes */
        ThirdPersonCamera: true, // When true you can zoom in more and rotate camera around player more freely with mouse
        FirstPersonCamera: true, // When true you can look from the player's head, like an FPS game and rotate camera without limit
        CameraMaxZoomOut: 5, // How far can you zoom out the camera, default:5. Note: Extreme values can break camera and/or
      };
      var RO = new ROBrowser(ROConfig);
      RO.start();
    }
    window.addEventListener("load", initialize, false);
  </script>
</head>

<body style="margin: 0px;padding: 0px; overflow: hidden;">
  <div id="robrowser" style="height: 100%;
    width: 100%;
    margin: 0;
    position: absolute;
    background-image:url(./client/data/texture/loading0<?php echo rand(0,6);?>.jpg);
    background-size:cover;
    background-position:center;">Initializing roBrowser...</div>
  <script>
  </script>
</body>

</html>