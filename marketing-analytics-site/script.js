(function() {
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const state = {
    consent: { ...window.DEFAULT_CONSENT },
    hasStoredChoice: false
  };

  const storageKey = 'consent.preferences.v2';

  function readStoredConsent() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function storeConsent(consent) {
    try { localStorage.setItem(storageKey, JSON.stringify(consent)); } catch (e) {}
  }

  function applyConsent(consent) {
    state.consent = { ...state.consent, ...consent };
    if (window.gtag) {
      gtag('consent', 'update', state.consent);
    }
  }

  function showBannerIfNeeded() {
    const stored = readStoredConsent();
    if (stored) {
      state.hasStoredChoice = true;
      applyConsent(stored);
      maybeLoadTags();
    } else {
      $('#consent-banner').classList.remove('hidden');
    }
  }

  function openPreferences() {
    const modal = $('#preferences-modal');
    modal.classList.remove('hidden');
    $('#pref-analytics').checked = state.consent.analytics_storage === 'granted';
    $('#pref-ads').checked = state.consent.ad_storage === 'granted' && state.consent.ad_user_data === 'granted';
  }

  function closePreferences() {
    $('#preferences-modal').classList.add('hidden');
  }

  function setAll(granted) {
    const value = granted ? 'granted' : 'denied';
    applyConsent({
      analytics_storage: value,
      ad_storage: value,
      ad_user_data: value,
      ad_personalization: value
    });
    storeConsent(state.consent);
    $('#consent-banner').classList.add('hidden');
    maybeLoadTags();
  }

  function savePreferences() {
    applyConsent({
      analytics_storage: $('#pref-analytics').checked ? 'granted' : 'denied',
      ad_storage: $('#pref-ads').checked ? 'granted' : 'denied',
      ad_user_data: $('#pref-ads').checked ? 'granted' : 'denied',
      ad_personalization: $('#pref-ads').checked ? 'granted' : 'denied',
    });
    storeConsent(state.consent);
    $('#consent-banner').classList.add('hidden');
    closePreferences();
    maybeLoadTags();
  }

  function loadScript(src, attrs = {}, beforeEl) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
      s.onload = resolve; s.onerror = reject;
      if (beforeEl) {
        document.head.insertBefore(s, beforeEl);
      } else {
        document.head.appendChild(s);
      }
    });
  }

  function insertInlineScript(code) {
    const s = document.createElement('script');
    s.text = code;
    document.head.appendChild(s);
  }

  function maybeLoadTags() {
    const cfg = window.ANALYTICS_CONFIG || {};
    const c = state.consent;

    // Load GTM if present
    if (cfg.gtmId && !maybeLoadTags._gtmLoaded) {
      maybeLoadTags._gtmLoaded = true;
      const gtmSrc = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(cfg.gtmId)}`;
      loadScript(gtmSrc, { async: '' }).catch(() => {});
    }

    // If GA4 direct and analytics consent granted
    if (!cfg.gtmId && cfg.gaMeasurementId && !maybeLoadTags._gaLoaded && c.analytics_storage === 'granted') {
      maybeLoadTags._gaLoaded = true;
      loadScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(cfg.gaMeasurementId), { async: '' })
        .then(() => {
          insertInlineScript(`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${cfg.gaMeasurementId}', { anonymize_ip: true });`);
        }).catch(() => {});
    }

    // Meta Pixel if advertising consent granted
    if (cfg.metaPixelId && !maybeLoadTags._metaLoaded && c.ad_storage === 'granted' && c.ad_user_data === 'granted') {
      maybeLoadTags._metaLoaded = true;
      insertInlineScript(`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod? n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n; n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js'); fbq('init', '${cfg.metaPixelId}'); fbq('consent', 'revoke');`);
      // fire only if ads consent
      insertInlineScript(`if (${JSON.stringify(c.ad_storage === 'granted' && c.ad_user_data === 'granted')}) { fbq('consent', 'grant'); fbq('track', 'PageView'); }`);
    }

    // LinkedIn Insight Tag
    if (cfg.linkedinPartnerId && !maybeLoadTags._liLoaded && c.ad_storage === 'granted' && c.ad_user_data === 'granted') {
      maybeLoadTags._liLoaded = true;
      insertInlineScript(`window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || []; window._linkedin_data_partner_ids.push('${cfg.linkedinPartnerId}');`);
      insertInlineScript(`(function(){var s = document.createElement('script'); s.type = 'text/javascript'; s.async = true; s.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js'; var x = document.getElementsByTagName('script')[0]; x.parentNode.insertBefore(s, x);})();`);
    }

    // TikTok Pixel
    if (cfg.tiktokPixelId && !maybeLoadTags._ttLoaded && c.ad_storage === 'granted' && c.ad_user_data === 'granted') {
      maybeLoadTags._ttLoaded = true;
      insertInlineScript(`!function (w, d, t) { w.TiktokAnalyticsObject = t; var ttq = w[t] = w[t] || []; ttq.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie'], ttq.setAndDefer = function (t, e) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))) } }; for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]); ttq.instance = function (t) { for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]); return e }, ttq.load = function (e, n) { var i = 'https://analytics.tiktok.com/i18n/pixel/events.js'; ttq._i = ttq._i || {}; ttq._i[e] = []; ttq._i[e]._u = i; ttq._t = ttq._t || {}; ttq._t[e] = +new Date; ttq._o = ttq._o || {}; ttq._o[e] = n || {}; var o = document.createElement('script'); o.type = 'text/javascript'; o.async = true; o.src = i + '?sdkid=' + e + '&lib=' + t; var a = document.getElementsByTagName('script')[0]; a.parentNode.insertBefore(o, a) }; ttq.load('${cfg.tiktokPixelId}'); ttq.page(); }(window, document, 'ttq');`);
    }

    // Google Ads tag can be configured via GTM; if using direct gtag, respect analytics/ads consent
    if (!cfg.gtmId && cfg.googleAdsId && !maybeLoadTags._adsLoaded && c.ad_storage === 'granted') {
      maybeLoadTags._adsLoaded = true;
      loadScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(cfg.googleAdsId), { async: '' })
        .then(() => {
          insertInlineScript(`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${cfg.googleAdsId}');`);
        }).catch(() => {});
    }
  }

  // Nav
  $('.nav-toggle').addEventListener('click', () => {
    const nav = $('.site-nav');
    const open = getComputedStyle(nav).display === 'none';
    nav.style.display = open ? 'inline-flex' : 'none';
  });

  // Footer year
  $('#year').textContent = new Date().getFullYear();

  // Consent banner events
  $('#consent-accept').addEventListener('click', () => setAll(true));
  $('#consent-reject').addEventListener('click', () => setAll(false));
  $('#consent-customize').addEventListener('click', openPreferences);

  $('#open-preferences').addEventListener('click', (e) => { e.preventDefault(); openPreferences(); });
  $('#preferences-close').addEventListener('click', closePreferences);
  $('#preferences-save').addEventListener('click', savePreferences);

  // Calendly placeholder
  $$('[data-calendly]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Integrate Calendly: paste your widget embed or link here.');
    });
  });

  // Initialize
  showBannerIfNeeded();
})();