const segmentEnabled = true
const segmentWriteKey = 'TBjdnqz9aQrkQr0soYl1l7nNPJW4UTye'

/* tslint:disable */
declare global {
  interface Window {
    analytics: any
  }
}

export const initialise = () => {
  // Segment tracking code from the segment website.
  const analytics = window.analytics = window.analytics || []; if (!analytics.initialize) {
    if (analytics.invoked)window.console && console.error && console.error('Segment snippet included twice.'); else { 
      analytics.invoked = !0; analytics.methods = ['trackSubmit', 'trackClick', 'trackLink', 'trackForm', 'pageview', 'identify', 'reset', 'group', 'track', 'ready', 'alias', 'debug', 'page', 'once', 'off', 'on']; analytics.factory = function (t) { return function () { const e = Array.prototype.slice.call(arguments); e.unshift(t); analytics.push(e); return analytics } }; for (let t = 0; t < analytics.methods.length; t++) { const e = analytics.methods[t]; analytics[e] = analytics.factory(e) }analytics.load = function (t, e) { const n = document.createElement('script'); n.type = 'text/javascript'; n.async = !0; n.src = `https://cdn.segment.com/analytics.js/v1/${t}/analytics.min.js`; const a = document.getElementsByTagName('script')[0] as any; a.parentNode.insertBefore(n, a); analytics._loadOptions = e }; analytics.SNIPPET_VERSION = '4.1.0'
      analytics.load(segmentWriteKey)
      analytics.ready(() => {
        setTimeout(() => {
          window.analytics.page()
          window.analytics.identify({})
        }, 5000)
      })
    } 
  }
  /* tslint:enable */
}

export const track = (event: string, properties?: string) => {
  if (window.analytics && segmentEnabled) {
    return window.analytics.track(event, properties)
  }
}

export const identify = (traits: object) => {
  if (window.analytics && segmentEnabled) {
    return window.analytics.identify(traits)
  }
}

export const reset = () => {
  if (window.analytics && segmentEnabled) {
    return window.analytics.reset()
  }
}

export const page = (name?: string, properties?: object) => {
  if (window.analytics && segmentEnabled) {
    return window.analytics.page(name, properties)
  }
}
