(function () {
  var scripts = document.getElementsByTagName('script');
  var currentScript = scripts[scripts.length - 1];
  var scriptSrc = currentScript.src;
  var baseUrl = scriptSrc.substring(0, scriptSrc.lastIndexOf('/'));
  var analyticsUrl = window.ANALYTICS_URL || baseUrl + '/api/analytics';
  var domainId = currentScript.getAttribute('data-domain-id') || window.ANALYTICS_DOMAIN_ID;
  var spoofedIp = currentScript.getAttribute('data-ip') || window.ANALYTICS_IP;
  var sessionId = sessionStorage.getItem('analytics_session') || generateSessionId();
  sessionStorage.setItem('analytics_session', sessionId);

  if (!domainId) {
    console.warn('Analytics: data-domain-id attribute not found. Analytics will not be sent.');
    return;
  }

  function generateSessionId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function getBrowserInfo(userAgent) {
    var browsers = {
      chrome: /Chrome\/(\d+)/,
      firefox: /Firefox\/(\d+)/,
      safari: /Version\/(\d+).*Safari/,
      edge: /Edg\/(\d+)/,
      opera: /OPR\/(\d+)/,
    };

    for (var name in browsers) {
      if (browsers[name].test(userAgent)) {
        return name.charAt(0).toUpperCase() + name.slice(1);
      }
    }
    return 'Unknown';
  }

  function getOS(userAgent) {
    var oses = {
      windows: { regex: /Windows/, name: 'Windows' },
      mac: { regex: /Mac/, name: 'macOS' },
      linux: { regex: /Linux/, name: 'Linux' },
      android: { regex: /Android/, name: 'Android' },
      ios: { regex: /iPhone|iPad|iPod/, name: 'iOS' },
    };

    for (var name in oses) {
      if (oses[name].regex.test(userAgent)) {
        return oses[name].name;
      }
    }
    return 'Unknown';
  }

  function getDevice(userAgent) {
    if (/iPad/.test(userAgent)) {
      return 'Tablet';
    }
    if (/Mobile|Android|iPhone|iPod/.test(userAgent)) {
      return 'Mobile';
    }
    return 'Desktop';
  }

  function track() {
    var data = {
      sessionId: sessionId,
      page: window.location.pathname,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      browser: getBrowserInfo(navigator.userAgent),
      os: getOS(navigator.userAgent),
      device: getDevice(navigator.userAgent),
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      language: navigator.language,
      url: window.location.href,
      domainId: domainId,
    };

    if (spoofedIp) {
      data.ip = spoofedIp;
    }

    sendData(data);
  }

  function sendData(data) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', analyticsUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
  }

  if (document.readyState === 'complete') {
    track();
  } else {
    window.addEventListener('load', track);
  }

  var originalPushState = history.pushState;
  history.pushState = function () {
    originalPushState.apply(this, arguments);
    track();
  };

  window.addEventListener('popstate', track);
})();
