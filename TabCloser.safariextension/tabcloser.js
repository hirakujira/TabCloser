safari.application.addEventListener("contextmenu", contextMenuHandler, false);
safari.application.addEventListener('command', function (event) {
  if (event.command === 'closeDuplicateURL') closeDuplicateURL();
  else if (event.command === 'closeDuplicateDomain') closeDuplicateDomain();
  else if (event.command === 'closeLeftTabs') closeLeftTabs();
  else if (event.command === 'closeRightTabs') closeRightTabs();
  return;
}, false);

var closeDuplicateURL = function() {
  var urls = {};
  safari.application.browserWindows.forEach(function(window) {
    window.tabs.forEach(function(tab) {
      if (urls[tab.url]) {
        tab.close();
      } 
      else {
        urls[tab.url] = true;
      };
    });
  });
};

var closeDuplicateDomain = function() {
  var domains = {};
  safari.application.browserWindows.forEach(function(window) {
    window.tabs.forEach(function(tab) {
      var arr = tab.url.split("/");
      var domain = arr[0] + "//" + arr[2];
      if (domains[domain]) {
        tab.close();
      }
      else {
        domains[domain] = true;
      };
    });
  });
};

var closeLeftTabs = function() {
  var info = new safariInfo();
  for (var i = 0; i < info.activeTabPosition; i++){
    safari.application.browserWindows[info.activeWindowPosition].tabs[0].close();
  }
}

var closeRightTabs = function() {
  var info = new safariInfo();
  for (var i = info.activeTabPosition+1; i < info.activeWindows_totalTab; i++){
    safari.application.browserWindows[info.activeWindowPosition].tabs[info.activeTabPosition+1].close();
  }
}

function contextMenuHandler(event) {
  var info = new safariInfo();
  var left_menu_title='';
  var right_menu_title='';
  if (info.activeTabPosition > 0){
    var temp = info.activeTabPosition;
    if(temp==1){
      left_menu_title = "Left Tab";
    }else{
      left_menu_title = temp+" Left Tabs";
    }
  }
  if (info.activeTabPosition < safari.application.browserWindows[info.activeWindowPosition].tabs.length-1){
    var temp = info.activeWindows_totalTab - 1 - info.activeTabPosition;
    if(temp==1){
      right_menu_title = "Right Tab";
    }else{
      right_menu_title = temp+" Right Tabs";
    }
  }

  if(event.contextMenu.contextMenuItems.length > 0) {
    event.contextMenu.appendContextMenuItem("separator001", "    ", "separator001");  
  }
  
  if(left_menu_title!=''){ event.contextMenu.appendContextMenuItem("closeLeftTabs", "Close "+left_menu_title, "closeLeftTabs");}
  if(right_menu_title!=''){event.contextMenu.appendContextMenuItem("closeRightTabs", "Close "+right_menu_title, "closeRightTabs");}
  
  if(event.contextMenu.contextMenuItems.length > 0){
    event.contextMenu.appendContextMenuItem("separator002", "    ", "separator002");
    event.contextMenu.appendContextMenuItem("closeDuplicateURL", "Close Duplicate URL Tabs", "closeDuplicateURL");
    event.contextMenu.appendContextMenuItem("closeDuplicateDomain", "Close Duplicate Domain Tabs", "closeDuplicateDomain");
  }
}

function safariInfo () {
  this.activeWindowPosition = 0;
  this.activeTabPosition = 0;
  this.activeWindows_totalTab = 0;
  this.totalTab=0;
  
  for (var i = 0; i < safari.application.browserWindows.length; i++){
    var theWindow = safari.application.browserWindows[i];
    if (theWindow === safari.application.activeBrowserWindow){
      this.activeWindowPosition = i;
    }
    var totalTabsInTheWindow = theWindow.tabs.length;
    this.totalTab = this.totalTab + totalTabsInTheWindow;
    for (var j = 0; j < totalTabsInTheWindow; j++){
      if (theWindow.tabs[j] === safari.application.activeBrowserWindow.activeTab){
        this.activeWindows_totalTab = totalTabsInTheWindow;
        this.activeTabPosition = j;
      }
    }
  }
}