import * as K from "three";
import { TrianglesDrawMode as La, TriangleFanDrawMode as xs, TriangleStripDrawMode as Yn, Loader as Na, LoaderUtils as lt, FileLoader as ks, MeshPhysicalMaterial as pe, Vector2 as se, Color as Oe, LinearSRGBColorSpace as Se, SRGBColorSpace as dt, SpotLight as Ba, PointLight as ja, DirectionalLight as Ua, Matrix4 as W, Vector3 as B, Quaternion as Ht, InstancedMesh as Qn, InstancedBufferAttribute as Ha, Object3D as Jn, TextureLoader as Ga, ImageBitmapLoader as Va, BufferAttribute as le, InterleavedBuffer as Xa, InterleavedBufferAttribute as qa, LinearMipmapLinearFilter as $n, NearestMipmapLinearFilter as Za, LinearMipmapNearestFilter as Wa, NearestMipmapNearestFilter as Ka, LinearFilter as Dt, NearestFilter as ea, RepeatWrapping as ys, MirroredRepeatWrapping as Ya, ClampToEdgeWrapping as Qa, PointsMaterial as ta, Material as Jt, LineBasicMaterial as Ja, MeshStandardMaterial as sa, DoubleSide as $a, MeshBasicMaterial as Ve, PropertyBinding as ei, BufferGeometry as Os, SkinnedMesh as ti, Mesh as na, LineSegments as si, Line as ni, LineLoop as ai, Points as aa, Group as Xe, PerspectiveCamera as ii, MathUtils as Ke, OrthographicCamera as ia, Skeleton as ri, AnimationClip as oi, Bone as li, InterpolateDiscrete as ci, InterpolateLinear as ra, Texture as js, VectorKeyframeTrack as Us, NumberKeyframeTrack as Hs, QuaternionKeyframeTrack as Gs, ColorManagement as Vs, FrontSide as ui, Interpolant as di, Box3 as Is, Sphere as Ds, LoadingManager as hi, EventDispatcher as vt, Ray as Ps, Euler as fi, Spherical as pi, Frustum as mi, DefaultLoadingManager as Gt, Matrix3 as oa, Plane as bi, TextureUtils as gi, Float32BufferAttribute as Xs, WebGLRenderer as xi, WebGLRenderTarget as qs, ShaderMaterial as yi, OneFactor as vi, ZeroFactor as wi, CustomBlending as Ti, Box2 as Ai, Matrix2 as Mi, Vector4 as Si, DataTexture as Ri } from "three";
function Zs(s) {
  if (!s) return null;
  let e = s.length, t = s.indexOf("?"), n = s.indexOf("#");
  t !== -1 && (e = Math.min(e, t)), n !== -1 && (e = Math.min(e, n));
  let a = s.lastIndexOf(".", e), i = s.lastIndexOf("/", e), r = s.indexOf("://");
  return r !== -1 && r + 2 === i || a === -1 || a < i ? null : s.substring(a + 1, e) || null;
}
var Pt = class {
  static pending = /* @__PURE__ */ new Map();
  static session = null;
  static setXRSession(s) {
    s !== this.session && (this.flushPending(), this.session = s);
  }
  static requestAnimationFrame(s) {
    let { session: e, pending: t } = this, n, a = () => {
      t.delete(n), s();
    };
    return n = e ? e.requestAnimationFrame(a) : requestAnimationFrame(a), t.set(n, s), n;
  }
  static cancelAnimationFrame(s) {
    let { pending: e, session: t } = this;
    e.delete(s), t ? t.cancelAnimationFrame(s) : cancelAnimationFrame(s);
  }
  static flushPending() {
    this.pending.forEach((s, e) => {
      s(), this.cancelAnimationFrame(e);
    });
  }
}, Ws = 2 ** 30, la = class {
  get unloadPriorityCallback() {
    return this._unloadPriorityCallback;
  }
  set unloadPriorityCallback(s) {
    s.length === 1 ? (console.warn('LRUCache: "unloadPriorityCallback" function has been changed to take two arguments.'), this._unloadPriorityCallback = (e, t) => {
      let n = s(e), a = s(t);
      return n < a ? -1 : +(n > a);
    }) : this._unloadPriorityCallback = s;
  }
  constructor() {
    this.minSize = 6e3, this.maxSize = 8e3, this.minBytesSize = 0.3 * Ws, this.maxBytesSize = 0.4 * Ws, this.unloadPercent = 0.05, this.autoMarkUnused = !0, this.itemSet = /* @__PURE__ */ new Map(), this.itemList = [], this.usedSet = /* @__PURE__ */ new Set(), this.callbacks = /* @__PURE__ */ new Map(), this.unloadingHandle = -1, this.cachedBytes = 0, this.bytesMap = /* @__PURE__ */ new Map(), this.loadedSet = /* @__PURE__ */ new Set(), this._unloadPriorityCallback = null;
    let s = this.itemSet;
    this.defaultPriorityCallback = (e) => s.get(e);
  }
  isFull() {
    return this.itemSet.size >= this.maxSize || this.cachedBytes >= this.maxBytesSize;
  }
  getMemoryUsage(s) {
    return this.bytesMap.get(s) || 0;
  }
  setMemoryUsage(s, e) {
    let { bytesMap: t, itemSet: n } = this;
    n.has(s) && (this.cachedBytes -= t.get(s) || 0, t.set(s, e), this.cachedBytes += e);
  }
  add(s, e) {
    let t = this.itemSet;
    if (t.has(s) || this.isFull()) return !1;
    let n = this.usedSet, a = this.itemList, i = this.callbacks;
    return a.push(s), n.add(s), t.set(s, Date.now()), i.set(s, e), !0;
  }
  has(s) {
    return this.itemSet.has(s);
  }
  remove(s) {
    let e = this.usedSet, t = this.itemSet, n = this.itemList, a = this.bytesMap, i = this.callbacks, r = this.loadedSet;
    if (t.has(s)) {
      this.cachedBytes -= a.get(s) || 0, a.delete(s), i.get(s)(s);
      let l = n.indexOf(s);
      return n.splice(l, 1), e.delete(s), t.delete(s), i.delete(s), r.delete(s), !0;
    }
    return !1;
  }
  setLoaded(s, e) {
    let { itemSet: t, loadedSet: n } = this;
    t.has(s) && (e === !0 ? n.add(s) : n.delete(s));
  }
  markUsed(s) {
    let e = this.itemSet, t = this.usedSet;
    e.has(s) && !t.has(s) && (e.set(s, Date.now()), t.add(s));
  }
  markUnused(s) {
    this.usedSet.delete(s);
  }
  markAllUnused() {
    this.usedSet.clear();
  }
  isUsed(s) {
    return this.usedSet.has(s);
  }
  unloadUnusedContent() {
    let { unloadPercent: s, minSize: e, maxSize: t, itemList: n, itemSet: a, usedSet: i, loadedSet: r, callbacks: l, bytesMap: o, minBytesSize: c, maxBytesSize: d } = this, u = n.length - i.size, h = n.length - r.size, f = Math.max(Math.min(n.length - e, u), 0), p = this.cachedBytes - c, y = this.unloadPriorityCallback || this.defaultPriorityCallback, g = !1, b = f > 0 && u > 0 || h && n.length > t;
    if (u && this.cachedBytes > c || h && this.cachedBytes > d || b) {
      n.sort((S, R) => {
        let E = i.has(S);
        if (E === i.has(R)) {
          let O = r.has(S);
          return O === r.has(R) ? -y(S, R) : O ? 1 : -1;
        } else return E ? 1 : -1;
      });
      let x = Math.max(e * s, f * s), m = Math.ceil(Math.min(x, u, f)), v = Math.max(s * p, s * c), w = Math.min(v, p), T = 0, M = 0;
      for (; this.cachedBytes - M > d || n.length - T > t; ) {
        let S = n[T], R = o.get(S) || 0;
        if (i.has(S) && r.has(S) || this.cachedBytes - M - R < d && n.length - T <= t) break;
        M += R, T++;
      }
      for (; M < w || T < m; ) {
        let S = n[T], R = o.get(S) || 0;
        if (i.has(S) || this.cachedBytes - M - R < c && T >= m) break;
        M += R, T++;
      }
      n.splice(0, T).forEach((S) => {
        this.cachedBytes -= o.get(S) || 0, l.get(S)(S), o.delete(S), a.delete(S), l.delete(S), r.delete(S), i.delete(S);
      }), g = T < f || M < p && T < u, g &&= T > 0;
    }
    g && (this.unloadingHandle = Pt.requestAnimationFrame(() => this.scheduleUnload()));
  }
  scheduleUnload() {
    Pt.cancelAnimationFrame(this.unloadingHandle), this.scheduled || (this.scheduled = !0, queueMicrotask(() => {
      this.scheduled = !1, this.unloadUnusedContent();
    }));
  }
}, Ei = class extends DOMException {
  constructor() {
    super("PriorityQueue: Item removed", "AbortError");
  }
}, bt = class {
  get running() {
    return this.items.length !== 0 || this.currJobs !== 0;
  }
  constructor() {
    this.maxJobs = 6, this.items = [], this.callbacks = /* @__PURE__ */ new Map(), this.currJobs = 0, this.scheduled = !1, this.autoUpdate = !0, this.priorityCallback = null, this._schedulingCallback = (s) => {
      Pt.requestAnimationFrame(s);
    }, this._runjobs = () => {
      this.scheduled = !1, this.tryRunJobs();
    };
  }
  sort() {
    let s = this.priorityCallback, e = this.items;
    s !== null && e.sort(s);
  }
  has(s) {
    return this.callbacks.has(s);
  }
  add(s, e) {
    let t = {
      callback: e,
      reject: null,
      resolve: null,
      promise: null
    };
    return t.promise = new Promise((n, a) => {
      let i = this.items, r = this.callbacks;
      t.resolve = n, t.reject = a, i.unshift(s), r.set(s, t), this.autoUpdate && this.scheduleJobRun();
    }), t.promise;
  }
  remove(s) {
    let e = this.items, t = this.callbacks, n = e.indexOf(s);
    if (n !== -1) {
      let a = t.get(s);
      a.promise.catch((i) => {
        if (i.name !== "AbortError") throw i;
      }), a.reject(new Ei()), e.splice(n, 1), t.delete(s);
    }
  }
  removeByFilter(s) {
    let { items: e } = this;
    for (let t = 0; t < e.length; t++) {
      let n = e[t];
      s(n) && (this.remove(n), t--);
    }
  }
  tryRunJobs() {
    this.sort();
    let s = this.items, e = this.callbacks, t = this.maxJobs, n = 0, a = () => {
      this.currJobs--, this.autoUpdate && this.scheduleJobRun();
    };
    for (; t > this.currJobs && s.length > 0 && n < t; ) {
      this.currJobs++, n++;
      let i = s.pop(), { callback: r, resolve: l, reject: o } = e.get(i);
      e.delete(i);
      let c;
      try {
        c = r(i);
      } catch (d) {
        o(d), a();
      }
      c instanceof Promise ? c.then(l).catch(o).finally(a) : (l(c), a());
    }
  }
  flush(s) {
    let { items: e, callbacks: t } = this, n = e.indexOf(s);
    if (!t.has(s)) return;
    let { callback: a, resolve: i, reject: r } = t.get(s);
    t.delete(s), e.splice(n, 1);
    let l;
    try {
      l = a(s);
    } catch (o) {
      r(o);
      return;
    }
    return l instanceof Promise ? l.then(i).catch(r) : i(l), l;
  }
  scheduleJobRun() {
    this.scheduled ||= (this._schedulingCallback(this._runjobs), !0);
  }
}, Ks = 6378137, Ci = 6356752314245179e-9, wt = {
  inView: !1,
  error: 1 / 0,
  distanceFromCamera: 1 / 0
};
function Vt(s) {
  return s === 4 || s === -1;
}
function Me(s, e) {
  return Xt(s) && s.traversal.lastFrameVisited === e && s.traversal.used;
}
function Xt(s) {
  return !!s.traversal;
}
function gt(s) {
  let { children: e } = s, t = e.length === 0 || Xt(e[e.length - 1]), n = !s.internal.hasUnrenderableContent || Vt(s.internal.loadingState);
  return t && n;
}
function Le(s) {
  return s.traversal.unconditionallyRefine;
}
function ht(s, e) {
  if (Xt(s) && (e.ensureChildrenArePreprocessed(s), s.traversal.lastFrameVisited !== e.frameCount && (s.traversal.wasInFrustum = s.traversal.inFrustum, s.traversal.wasSetActive = s.traversal.active, s.traversal.wasSetVisible = s.traversal.visible, s.traversal.usedLastFrame = s.traversal.used, s.traversal.lastFrameVisited = e.frameCount, s.traversal.used = !1, s.traversal.inFrustum = !1, s.traversal.isLeaf = !1, s.traversal.visible = !1, s.traversal.active = !1, s.traversal.error = 1 / 0, s.traversal.distanceFromCamera = 1 / 0, s.traversal.allChildrenReady = !1, s.traversal.allChildrenLoaded = !1, s.traversal.kicked = !1, s.traversal.allUsedChildrenProcessed = !1, e.calculateTileViewErrorWithPlugin(s, wt), s.traversal.inFrustum = wt.inView, s.traversal.error = wt.error, s.traversal.distanceFromCamera = wt.distanceFromCamera, s.traversal.unconditionallyRefine = s.internal.hasUnrenderableContent, !s.traversal.unconditionallyRefine))) {
    let t = s.parent;
    for (; t && t.traversal.unconditionallyRefine; ) t = t.parent;
    t && t.geometricError <= s.geometricError && (s.traversal.unconditionallyRefine = !0);
  }
}
function vs(s, e, t = !1) {
  if (ht(s, e), t ? e.markTileUsed(s) : zt(s), Le(s) && gt(s)) {
    let n = s.children;
    for (let a = 0, i = n.length; a < i; a++) vs(n[a], e, t);
  }
}
function ca(s, e) {
  if (ht(s, e), s.traversal.usedLastFrame && (zt(s), s.traversal.wasSetActive && (s.traversal.active = !0), (!s.traversal.active || Le(s)) && gt(s))) {
    let t = s.children;
    for (let n = 0, a = t.length; n < a; n++) ca(t[n], e);
  }
}
function zt(s) {
  s.traversal.used = !0;
}
function Fi(s, e) {
  return !(s.traversal.error <= e.errorTarget && !Le(s) || e.maxDepth > 0 && s.internal.depth + 1 >= e.maxDepth || !gt(s));
}
function ua(s, e) {
  let { frameCount: t } = e, { children: n } = s;
  for (let a = 0, i = n.length; a < i; a++) {
    let r = n[a];
    Me(r, t) && (r.traversal.active && (r.traversal.kicked = !0, r.traversal.active = !1), ua(r, e));
  }
}
function Ys(s) {
  return !Le(s) && (!s.internal.hasContent || Vt(s.internal.loadingState));
}
function da(s, e) {
  if (ht(s, e), !s.traversal.inFrustum) return;
  let t = s.parent;
  if (t && t.refine === "ADD" && s.geometricError > 0 && s.traversal.error * (t.geometricError / s.geometricError) <= e.errorTarget) return;
  if (!Fi(s, e)) {
    zt(s);
    return;
  }
  let n = !1, a = !1, i = s.children;
  for (let r = 0, l = i.length; r < l; r++) {
    let o = i[r];
    da(o, e), n ||= Me(o, e.frameCount), a ||= o.traversal.inFrustum;
  }
  if (s.refine === "REPLACE" && !a && i.length !== 0) {
    s.traversal.inFrustum = !1, e.markTileUsed(s);
    for (let r = 0, l = i.length; r < l; r++) vs(i[r], e, !0);
    return;
  }
  if (zt(s), s.refine === "REPLACE" && n && (e.loadSiblings || e.loadAncestors)) for (let r = 0, l = i.length; r < l; r++) vs(i[r], e);
}
function ha(s, e) {
  let t = e.frameCount;
  if (!Me(s, t)) return;
  let n = s.children, a = !1;
  for (let r = 0, l = n.length; r < l; r++) {
    let o = n[r];
    a ||= Me(o, t);
  }
  if (!a) s.traversal.isLeaf = !0;
  else {
    for (let l = 0, o = n.length; l < o; l++) ha(n[l], e);
    let r = !0;
    for (let l = 0, o = n.length; l < o; l++) {
      let c = n[l];
      if (Me(c, t)) {
        let d = !Le(c), u = !c.internal.hasContent || Vt(c.internal.loadingState);
        d && u || c.traversal.allChildrenLoaded || (r = !1);
      }
    }
    s.traversal.allChildrenLoaded = r;
  }
  let i = !0;
  for (let r = 0, l = n.length; r < l; r++) {
    let o = n[r];
    Me(o, e.frameCount) && !o.traversal.allUsedChildrenProcessed && (i = !1);
  }
  s.traversal.allUsedChildrenProcessed = i && gt(s);
}
function fa(s, e) {
  if (!Me(s, e.frameCount)) return;
  let t = s.children;
  if (s.refine === "REPLACE" && e.loadAncestors && !s.traversal.allChildrenLoaded && !Le(s) && (s.traversal.isLeaf = !0), s.traversal.isLeaf) {
    if (!Le(s) && (s.traversal.active = !0, gt(s) && s.internal.hasContent && !Vt(s.internal.loadingState))) for (let a = 0, i = t.length; a < i; a++) ca(t[a], e);
    return;
  }
  let n = t.length > 0;
  for (let a = 0, i = t.length; a < i; a++) {
    let r = t[a];
    fa(r, e), Me(r, e.frameCount) && !(r.traversal.active && Ys(r)) && !r.traversal.allChildrenReady && (n = !1);
  }
  s.traversal.allChildrenReady = n, s.refine === "REPLACE" && !n && s.traversal.wasSetActive && Ys(s) && (s.traversal.active = !0, ua(s, e));
}
function pa(s, e) {
  ht(s, e);
  let t = Me(s, e.frameCount);
  if (t && (s.internal.hasUnrenderableContent && (e.markTileUsed(s), e.queueTileForDownload(s)), s.internal.hasRenderableContent && s.refine === "ADD" && (s.traversal.active = !0), (s.traversal.active || s.traversal.kicked) && s.internal.hasContent && (e.markTileUsed(s), s.traversal.allUsedChildrenProcessed && e.queueTileForDownload(s), s.internal.loadingState !== 4 && (s.traversal.active = !1)), e.loadAncestors && s.internal.hasContent && (e.markTileUsed(s), e.queueTileForDownload(s)), s.internal.virtualChildCount > 0 && s.internal.hasContent && e.markTileUsed(s), s.traversal.visible = s.internal.hasRenderableContent && s.traversal.active && s.traversal.inFrustum && s.internal.loadingState === 4, e.stats.used++, s.traversal.inFrustum && e.stats.inFrustum++), t || Xt(s) && s.traversal.usedLastFrame) {
    let n = !1, a = !1;
    t ? (n = s.traversal.active, a = e.displayActiveTiles && s.traversal.active || s.traversal.visible) : ht(s, e), s.internal.hasRenderableContent && s.internal.loadingState === 4 ? (n && e.stats.active++, a && e.stats.visible++, s.traversal.wasSetActive !== n && e.invokeOnePlugin((r) => r.setTileActive && r.setTileActive(s, n)), s.traversal.wasSetVisible !== a && e.invokeOnePlugin((r) => r.setTileVisible && r.setTileVisible(s, a))) : s.internal.hasRenderableContent || (a = s.traversal.isLeaf, s.traversal.wasSetVisible !== a && e.invokeOnePlugin((r) => r.setEmptyTileVisible && r.setEmptyTileVisible(s, a))), s.traversal.visible = a, s.traversal.active = n;
    let i = s.children;
    for (let r = 0, l = i.length; r < l; r++) {
      let o = i[r];
      pa(o, e);
    }
  }
}
function ki(s, e) {
  da(s, e), ha(s, e), fa(s, e), pa(s, e);
}
function Oi(s) {
  let e = null;
  return () => {
    e === null && (e = Pt.requestAnimationFrame(() => {
      e = null, s();
    }));
  };
}
function Ii(s, e = null, t = null) {
  let n = [];
  for (n.push(s), n.push(null), n.push(0); n.length > 0; ) {
    let a = n.pop(), i = n.pop(), r = n.pop();
    if (e && e(r, i, a)) {
      t && t(r, i, a);
      return;
    }
    let l = r.children;
    if (l) for (let o = l.length - 1; o >= 0; o--) n.push(l[o]), n.push(r), n.push(a + 1);
    t && t(r, i, a);
  }
}
var Qs = /* @__PURE__ */ Symbol("PLUGIN_REGISTERED"), Re = {
  inView: !0,
  error: 0,
  distance: 1 / 0
}, Di = (s, e) => {
  let t = s.priority || 0, n = e.priority || 0;
  return t === n ? !s.traversal || !e.traversal ? 0 : s.traversal.used === e.traversal.used ? s.traversal.error === e.traversal.error ? s.traversal.distanceFromCamera === e.traversal.distanceFromCamera ? s.internal.depthFromRenderedParent === e.internal.depthFromRenderedParent ? 0 : s.internal.depthFromRenderedParent > e.internal.depthFromRenderedParent ? -1 : 1 : s.traversal.distanceFromCamera > e.traversal.distanceFromCamera ? -1 : 1 : s.traversal.error > e.traversal.error ? 1 : -1 : s.traversal.used ? 1 : -1 : t > n ? 1 : -1;
}, Pi = (s, e) => s.traversal.used === e.traversal.used ? s.traversal.inFrustum === e.traversal.inFrustum ? s.internal.hasUnrenderableContent === e.internal.hasUnrenderableContent ? s.traversal.distanceFromCamera === e.traversal.distanceFromCamera ? s.internal.depthFromRenderedParent === e.internal.depthFromRenderedParent ? 0 : s.internal.depthFromRenderedParent > e.internal.depthFromRenderedParent ? -1 : 1 : s.traversal.distanceFromCamera > e.traversal.distanceFromCamera ? -1 : 1 : s.internal.hasUnrenderableContent ? 1 : -1 : s.traversal.inFrustum ? 1 : -1 : s.traversal.used ? 1 : -1, zi = (s, e) => s.traversal.lastFrameVisited === e.traversal.lastFrameVisited ? s.internal.depthFromRenderedParent === e.internal.depthFromRenderedParent ? s.internal.loadingState === e.internal.loadingState ? s.internal.hasUnrenderableContent === e.internal.hasUnrenderableContent ? s.traversal.error === e.traversal.error ? 0 : s.traversal.error > e.traversal.error ? -1 : 1 : s.internal.hasUnrenderableContent ? -1 : 1 : s.internal.loadingState > e.internal.loadingState ? -1 : 1 : s.internal.depthFromRenderedParent > e.internal.depthFromRenderedParent ? 1 : -1 : s.traversal.lastFrameVisited > e.traversal.lastFrameVisited ? -1 : 1, qt = (s, e) => {
  let t = s.priority ?? 1 / 0, n = e.priority ?? 1 / 0;
  if (t !== n) return t > n ? 1 : -1;
  if (!s.internal || !e.internal) return 0;
  let a = s.internal.renderer, i = e.internal.renderer, r = !a.loadAncestors, l = !i.loadAncestors;
  return r && l ? Pi(s, e) : Di(s, e);
}, zs = new la();
zs.unloadPriorityCallback = zi;
var _t = new bt();
_t.maxJobs = 25, _t.priorityCallback = qt;
var Lt = new bt();
Lt.maxJobs = 5, Lt.priorityCallback = qt;
var Nt = new bt();
Nt.maxJobs = 25, Nt.priorityCallback = (s, e) => {
  let t = s.parent, n = e.parent;
  return t === n ? 0 : t ? n ? qt(t, n) : -1 : 1;
};
var _i = class {
  get root() {
    let s = this.rootTileset;
    return s ? s.root : null;
  }
  get loadProgress() {
    let { stats: s, isLoading: e } = this, t = s.queued + s.downloading + s.parsing, n = s.inCacheSinceLoad + +!!e;
    return n === 0 ? 1 : 1 - t / n;
  }
  constructor(s = null) {
    this.rootLoadingState = 0, this.rootTileset = null, this.rootURL = s, this.fetchOptions = {}, this.plugins = [], this.queuedTiles = [], this.cachedSinceLoadComplete = /* @__PURE__ */ new Set(), this.isLoading = !1, this.processedTiles = /* @__PURE__ */ new WeakSet(), this.visibleTiles = /* @__PURE__ */ new Set(), this.activeTiles = /* @__PURE__ */ new Set(), this.usedSet = /* @__PURE__ */ new Set(), this.loadingTiles = /* @__PURE__ */ new Set(), this.lruCache = zs, this.downloadQueue = _t, this.parseQueue = Lt, this.processNodeQueue = Nt, this.stats = {
      inCacheSinceLoad: 0,
      inCache: 0,
      queued: 0,
      downloading: 0,
      parsing: 0,
      loaded: 0,
      failed: 0,
      inFrustum: 0,
      used: 0,
      active: 0,
      visible: 0,
      tilesProcessed: 0
    }, this.frameCount = 0, this._dispatchNeedsUpdateEvent = Oi(() => {
      this.dispatchEvent({ type: "needs-update" });
    }), this.errorTarget = 16, this.displayActiveTiles = !1, this.maxDepth = 1 / 0, this.loadSiblings = !0, this.loadAncestors = !0, this.maxTilesProcessed = 250;
  }
  registerPlugin(s) {
    if (s[Qs] === !0) throw Error("TilesRendererBase: A plugin can only be registered to a single tileset");
    let e = this.plugins, t = s.priority || 0, n = e.length;
    for (let a = 0; a < e.length; a++) if ((e[a].priority || 0) > t) {
      n = a;
      break;
    }
    e.splice(n, 0, s), s[Qs] = !0, s.init && s.init(this);
  }
  unregisterPlugin(s) {
    let e = this.plugins;
    if (typeof s == "string" && (s = this.getPluginByName(s)), e.includes(s)) {
      let t = e.indexOf(s);
      return e.splice(t, 1), s.dispose && s.dispose(), !0;
    }
    return !1;
  }
  getPluginByName(s) {
    return this.plugins.find((e) => e.name === s) || null;
  }
  invokeOnePlugin(s) {
    let e = [...this.plugins, this];
    for (let t = 0; t < e.length; t++) {
      let n = s(e[t]);
      if (n) return n;
    }
    return null;
  }
  invokeAllPlugins(s) {
    let e = [...this.plugins, this], t = [];
    for (let n = 0; n < e.length; n++) {
      let a = s(e[n]);
      a && t.push(a);
    }
    return t.length === 0 ? null : Promise.all(t);
  }
  traverse(s, e, t = !0) {
    this.root && Ii(this.root, (n, ...a) => (t && this.ensureChildrenArePreprocessed(n, !0), s ? s(n, ...a) : !1), e);
  }
  getAttributions(s = []) {
    return this.invokeAllPlugins((e) => e !== this && e.getAttributions && e.getAttributions(s)), s;
  }
  update() {
    let { lruCache: s, usedSet: e, stats: t, root: n, downloadQueue: a, parseQueue: i, processNodeQueue: r } = this;
    if (this.rootLoadingState === 0 && (this.rootLoadingState = 2, this.invokeOnePlugin((c) => c.loadRootTileset && c.loadRootTileset()).then((c) => {
      let d = this.rootURL;
      d !== null && this.invokeAllPlugins((u) => d = u.preprocessURL ? u.preprocessURL(d, null) : d), this.rootLoadingState = 4, this.rootTileset = c, this.dispatchEvent({ type: "needs-update" }), this.dispatchEvent({
        type: "load-tileset",
        tileset: c,
        url: d
      }), this.dispatchEvent({
        type: "load-root-tileset",
        tileset: c,
        url: d
      });
    }).catch((c) => {
      this.rootLoadingState = -1, console.error(c), this.rootTileset = null, this.dispatchEvent({
        type: "load-error",
        tile: null,
        error: c,
        url: this.rootURL
      });
    })), !n) return;
    let l = null;
    if (this.invokeAllPlugins((c) => {
      if (c.doTilesNeedUpdate) {
        let d = c.doTilesNeedUpdate();
        l = l === null ? d : !!(l || d);
      }
    }), l === !1) {
      this.dispatchEvent({ type: "update-before" }), this.dispatchEvent({ type: "update-after" });
      return;
    }
    this.dispatchEvent({ type: "update-before" }), t.inFrustum = 0, t.used = 0, t.active = 0, t.visible = 0, t.tilesProcessed = 0, this.frameCount++, e.forEach((c) => s.markUnused(c)), e.clear(), this.prepareForTraversal(), ki(n, this), this.removeUnusedPendingTiles();
    let o = this.queuedTiles;
    o.sort(s.unloadPriorityCallback);
    for (let c = 0, d = o.length; c < d && !s.isFull(); c++) this.requestTileContents(o[c]);
    o.length = 0, s.scheduleUnload(), (a.running || i.running || r.running) === !1 && this.isLoading === !0 && (this.cachedSinceLoadComplete.clear(), t.inCacheSinceLoad = 0, this.dispatchEvent({ type: "tiles-load-end" }), this.isLoading = !1), this.dispatchEvent({ type: "update-after" });
  }
  resetFailedTiles() {
    this.rootLoadingState === -1 && (this.rootLoadingState = 0);
    let s = this.stats;
    s.failed !== 0 && (this.traverse((e) => {
      e.internal.loadingState === -1 && (e.internal.loadingState = 0);
    }, null, !1), s.failed = 0);
  }
  calculateTileViewErrorWithPlugin(s, e) {
    this.calculateTileViewError(s, e);
    let t = null, n = 0, a = 1 / 0;
    this.invokeAllPlugins((i) => {
      i !== this && i.calculateTileViewError && (Re.inView = !0, Re.error = 0, Re.distance = 1 / 0, i.calculateTileViewError(s, Re) && (t === null && (t = !0), t &&= Re.inView, Re.inView && (a = Math.min(a, Re.distance), n = Math.max(n, Re.error))));
    }), e.inView && t !== !1 ? (e.error = Math.max(e.error, n), e.distanceFromCamera = Math.min(e.distanceFromCamera, a)) : t ? (e.inView = !0, e.error = n, e.distanceFromCamera = a) : e.inView = !1;
  }
  dispose() {
    [...this.plugins].forEach((t) => {
      this.unregisterPlugin(t);
    });
    let s = this.lruCache, e = [];
    this.traverse((t) => (e.push(t), !1), null, !1);
    for (let t = 0, n = e.length; t < n; t++) s.remove(e[t]);
    this.stats = {
      queued: 0,
      parsing: 0,
      downloading: 0,
      failed: 0,
      inFrustum: 0,
      traversed: 0,
      used: 0,
      active: 0,
      visible: 0
    }, this.frameCount = 0, this.loadingTiles.clear();
  }
  calculateBytesUsed(s, e) {
    return 0;
  }
  dispatchEvent(s) {
  }
  addEventListener(s, e) {
  }
  removeEventListener(s, e) {
  }
  parseTile(s, e, t) {
    return null;
  }
  prepareForTraversal() {
  }
  disposeTile(s) {
    s.traversal.visible && (s.internal.hasRenderableContent ? this.invokeOnePlugin((t) => t.setTileVisible && t.setTileVisible(s, !1)) : this.invokeOnePlugin((t) => t.setEmptyTileVisible && t.setEmptyTileVisible(s, !1)), s.traversal.visible = !1), s.traversal.active && s.internal.hasRenderableContent && this.invokeOnePlugin((t) => t.setTileActive && t.setTileActive(s, !1)), s.traversal.active = !1;
    let { scene: e } = s.engineData;
    e && this.dispatchEvent({
      type: "dispose-model",
      scene: e,
      tile: s
    });
  }
  preprocessNode(s, e, t = null) {
    if (this.processedTiles.add(s), this.stats.tilesProcessed++, s.content && (!("uri" in s.content) && "url" in s.content && (s.content.uri = s.content.url, delete s.content.url), s.content.boundingVolume && !("box" in s.content.boundingVolume || "sphere" in s.content.boundingVolume || "region" in s.content.boundingVolume) && delete s.content.boundingVolume), s.parent = t, s.children = s.children || [], s.internal = {
      hasContent: !1,
      hasRenderableContent: !1,
      hasUnrenderableContent: !1,
      loadingState: 0,
      basePath: e,
      depth: -1,
      depthFromRenderedParent: -1,
      isVirtual: !1,
      virtualChildCount: 0,
      renderer: this,
      ...s.internal
    }, s.content?.uri) {
      let n = Zs(s.content.uri), a = !!(n && /json$/.test(n));
      s.internal.hasContent = !0, s.internal.hasUnrenderableContent = a, s.internal.hasRenderableContent = !a;
    } else s.internal.hasContent = !1, s.internal.hasUnrenderableContent = !1, s.internal.hasRenderableContent = !1;
    t ? (s.internal.depth = t.internal.depth + 1, s.internal.depthFromRenderedParent = t.internal.depthFromRenderedParent + +!!s.internal.hasRenderableContent) : (s.internal.depth = 0, s.internal.depthFromRenderedParent = +!!s.internal.hasRenderableContent), s.traversal = {
      distanceFromCamera: 1 / 0,
      error: 1 / 0,
      inFrustum: !1,
      wasInFrustum: !1,
      isLeaf: !1,
      used: !1,
      usedLastFrame: !1,
      visible: !1,
      wasSetVisible: !1,
      active: !1,
      wasSetActive: !1,
      allChildrenReady: !1,
      allChildrenLoaded: !1,
      kicked: !1,
      allUsedChildrenProcessed: !1,
      lastFrameVisited: -1
    }, t === null ? s.refine = s.refine || "REPLACE" : s.refine = s.refine || t.refine, s.engineData = {
      scene: null,
      metadata: null,
      boundingVolume: null
    }, Object.defineProperty(s, "cached", {
      get() {
        return console.warn('TilesRenderer: "tile.cached" field has been renamed to "tile.engineData".'), this.engineData;
      },
      enumerable: !1,
      configurable: !0
    }), this.invokeAllPlugins((n) => {
      n !== this && n.preprocessNode && n.preprocessNode(s, e, t);
    });
  }
  setTileActive(s, e) {
    e ? this.activeTiles.add(s) : this.activeTiles.delete(s);
  }
  setTileVisible(s, e) {
    e ? this.visibleTiles.add(s) : this.visibleTiles.delete(s), this.dispatchEvent({
      type: "tile-visibility-change",
      scene: s.engineData.scene,
      tile: s,
      visible: e
    });
  }
  calculateTileViewError(s, e) {
  }
  removeUnusedPendingTiles() {
    let { lruCache: s, loadingTiles: e } = this, t = [];
    for (let n of e) !s.isUsed(n) && n.internal.loadingState === 1 && t.push(n);
    for (let n = 0; n < t.length; n++) s.remove(t[n]);
  }
  queueTileForDownload(s) {
    s.internal.loadingState !== 0 || this.lruCache.isFull() || this.queuedTiles.push(s);
  }
  markTileUsed(s) {
    this.usedSet.add(s), this.lruCache.markUsed(s);
  }
  fetchData(s, e) {
    return fetch(s, e);
  }
  ensureChildrenArePreprocessed(s, e = this.stats.tilesProcessed < this.maxTilesProcessed) {
    let t = s.children;
    if (t.length === 0 || t[t.length - 1].traversal) return;
    let n = (a) => {
      for (let i = 0, r = a.length; i < r; i++) {
        let l = a[i];
        l && !l.traversal && this.preprocessNode(l, s.internal.basePath, s);
      }
    };
    e ? (this.processNodeQueue.remove(s), n(t)) : this.processNodeQueue.has(s) || this.processNodeQueue.add(s, (a) => {
      n(a.children), this._dispatchNeedsUpdateEvent();
    });
  }
  getBytesUsed(s) {
    let e = 0;
    return this.invokeAllPlugins((t) => {
      t.calculateBytesUsed && (e += t.calculateBytesUsed(s, s.engineData.scene) || 0);
    }), e;
  }
  recalculateBytesUsed(s = null) {
    let { lruCache: e, processedTiles: t } = this;
    s === null ? e.itemSet.forEach((n) => {
      t.has(n) && e.setMemoryUsage(n, this.getBytesUsed(n));
    }) : e.setMemoryUsage(s, this.getBytesUsed(s));
  }
  preprocessTileset(s, e, t = null) {
    let [n, a] = s.asset.version.split(".").map((r) => parseInt(r));
    console.assert(n <= 1, "TilesRenderer: asset.version is expected to be a 1.x or a compatible version."), n === 1 && a > 0 && console.warn("TilesRenderer: tiles versions at 1.1 or higher have limited support. Some new extensions and features may not be supported.");
    let i = e.replace(/\/[^/]*$/, "");
    i = new URL(i, window.location.href).toString(), this.preprocessNode(s.root, i, t);
  }
  loadRootTileset() {
    let s = this.rootURL;
    return this.invokeAllPlugins((e) => s = e.preprocessURL ? e.preprocessURL(s, null) : s), this.invokeOnePlugin((e) => e.fetchData && e.fetchData(s, this.fetchOptions)).then((e) => {
      if (!(e instanceof Response)) return e;
      if (e.ok) return e.json();
      throw Error(`TilesRenderer: Failed to load tileset "${s}" with status ${e.status} : ${e.statusText}`);
    }).then((e) => (this.preprocessTileset(e, s), e));
  }
  requestTileContents(s) {
    if (s.internal.loadingState !== 0) return;
    let e = !1, t = null, n = new URL(s.content.uri, s.internal.basePath + "/").toString();
    this.invokeAllPlugins((h) => n = h.preprocessURL ? h.preprocessURL(n, s) : n);
    let a = this.stats, i = this.lruCache, r = this.downloadQueue, l = this.parseQueue, o = this.loadingTiles, c = Zs(n), d = new AbortController(), u = d.signal;
    if (i.add(s, (h) => {
      d.abort(), e ? h.children.length = 0 : this.invokeAllPlugins((f) => {
        f.disposeTile && f.disposeTile(h);
      }), a.inCache--, this.cachedSinceLoadComplete.has(s) && (this.cachedSinceLoadComplete.delete(s), a.inCacheSinceLoad--), h.internal.loadingState === 1 ? a.queued-- : h.internal.loadingState === 2 ? a.downloading-- : h.internal.loadingState === 3 ? a.parsing-- : h.internal.loadingState === 4 && a.loaded--, h.internal.loadingState = 0, l.remove(h), r.remove(h), o.delete(h);
    })) return this.isLoading || (this.isLoading = !0, this.dispatchEvent({ type: "tiles-load-start" })), i.setMemoryUsage(s, this.getBytesUsed(s)), this.cachedSinceLoadComplete.add(s), a.inCacheSinceLoad++, a.inCache++, a.queued++, s.internal.loadingState = 1, o.add(s), r.add(s, (h) => {
      if (u.aborted) return Promise.resolve();
      s.internal.loadingState = 2, a.downloading++, a.queued--;
      let f = this.invokeOnePlugin((p) => p.fetchData && p.fetchData(n, {
        ...this.fetchOptions,
        signal: u
      }));
      return this.dispatchEvent({
        type: "tile-download-start",
        tile: s,
        url: n,
        get uri() {
          return console.warn('tile-download-start event: "uri" has been renamed to "url".'), this.url;
        }
      }), f;
    }).then((h) => {
      if (!u.aborted) {
        if (!(h instanceof Response)) return h;
        if (h.ok) return c === "json" ? h.json() : h.arrayBuffer();
        throw Error(`Failed to load model with error code ${h.status}`);
      }
    }).then((h) => {
      if (!u.aborted) return a.downloading--, a.parsing++, s.internal.loadingState = 3, l.add(s, (f) => u.aborted ? Promise.resolve() : c === "json" && h.root ? (this.preprocessTileset(h, n, s), s.children.push(h.root), t = h, e = !0, Promise.resolve()) : this.invokeOnePlugin((p) => p.parseTile && p.parseTile(h, f, c, n, u)));
    }).then(() => {
      if (u.aborted) return;
      a.parsing--, a.loaded++, s.internal.loadingState = 4, o.delete(s), i.setLoaded(s, !0);
      let h = this.getBytesUsed(s);
      if (i.getMemoryUsage(s) === 0 && h > 0 && i.isFull()) {
        i.remove(s);
        return;
      }
      i.setMemoryUsage(s, h), this.dispatchEvent({ type: "needs-update" }), e && this.dispatchEvent({
        type: "load-tileset",
        tileset: t,
        url: n
      }), s.engineData.scene && this.dispatchEvent({
        type: "load-model",
        scene: s.engineData.scene,
        tile: s,
        url: n
      });
    }).catch((h) => {
      u.aborted || (h.name === "AbortError" ? i.remove(s) : (l.remove(s), r.remove(s), s.internal.loadingState === 1 ? a.queued-- : s.internal.loadingState === 2 ? a.downloading-- : s.internal.loadingState === 3 ? a.parsing-- : s.internal.loadingState === 4 && a.loaded--, a.failed++, console.error(`TilesRenderer : Failed to load tile at url "${s.content.uri}".`), console.error(h), s.internal.loadingState = -1, o.delete(s), i.setLoaded(s, !0), this.dispatchEvent({
        type: "load-error",
        tile: s,
        error: h,
        url: n
      })));
    });
  }
};
function We(s) {
  if (s === null || s.byteLength < 4) return "";
  let e;
  if (e = s instanceof DataView ? s : new DataView(s), String.fromCharCode(e.getUint8(0)) === "{") return null;
  let t = "";
  for (let n = 0; n < 4; n++) t += String.fromCharCode(e.getUint8(n));
  return t;
}
var Li = new TextDecoder();
function ma(s) {
  return Li.decode(s);
}
function _s(s) {
  return s.replace(/[\\/][^\\/]+$/, "") + "/";
}
var Zt = class {
  constructor() {
    this.fetchOptions = {}, this.workingPath = "";
  }
  loadAsync(s) {
    return fetch(s, this.fetchOptions).then((e) => {
      if (!e.ok) throw Error(`Failed to load file "${s}" with status ${e.status} : ${e.statusText}`);
      return e.arrayBuffer();
    }).then((e) => (this.workingPath === "" && (this.workingPath = _s(s)), this.parse(e)));
  }
  resolveExternalURL(s) {
    return new URL(s, this.workingPath).href;
  }
  parse(s) {
    throw Error("LoaderBase: Parse not implemented.");
  }
};
function ba(s, e, t, n, a, i) {
  let r;
  switch (n) {
    case "SCALAR":
      r = 1;
      break;
    case "VEC2":
      r = 2;
      break;
    case "VEC3":
      r = 3;
      break;
    case "VEC4":
      r = 4;
      break;
    default:
      throw Error(`FeatureTable : Feature type not provided for "${i}".`);
  }
  let l, o = t * r;
  switch (a) {
    case "BYTE":
      l = new Int8Array(s, e, o);
      break;
    case "UNSIGNED_BYTE":
      l = new Uint8Array(s, e, o);
      break;
    case "SHORT":
      l = new Int16Array(s, e, o);
      break;
    case "UNSIGNED_SHORT":
      l = new Uint16Array(s, e, o);
      break;
    case "INT":
      l = new Int32Array(s, e, o);
      break;
    case "UNSIGNED_INT":
      l = new Uint32Array(s, e, o);
      break;
    case "FLOAT":
      l = new Float32Array(s, e, o);
      break;
    case "DOUBLE":
      l = new Float64Array(s, e, o);
      break;
    default:
      throw Error(`FeatureTable : Feature component type not provided for "${i}".`);
  }
  return l;
}
var Wt = class {
  constructor(s, e, t, n) {
    this.buffer = s, this.binOffset = e + t, this.binLength = n;
    let a = null;
    if (t !== 0) {
      let i = new Uint8Array(s, e, t);
      a = JSON.parse(ma(i));
    } else a = {};
    this.header = a;
  }
  getKeys() {
    return Object.keys(this.header).filter((s) => s !== "extensions");
  }
  getData(s, e, t = null, n = null) {
    let a = this.header;
    if (!(s in a)) return null;
    let i = a[s];
    if (!(i instanceof Object) || Array.isArray(i)) return i;
    {
      let { buffer: r, binOffset: l, binLength: o } = this, c = i.byteOffset || 0, d = i.type || n, u = i.componentType || t;
      if ("type" in i && n && i.type !== n) throw Error("FeatureTable: Specified type does not match expected type.");
      let h = l + c, f = ba(r, h, e, d, u, s);
      if (h + f.byteLength > l + o) throw Error("FeatureTable: Feature data read outside binary body length.");
      return f;
    }
  }
  getBuffer(s, e) {
    let { buffer: t, binOffset: n } = this;
    return t.slice(n + s, n + s + e);
  }
}, Ni = class {
  constructor(s) {
    this.batchTable = s;
    let e = s.header.extensions["3DTILES_batch_table_hierarchy"];
    this.classes = e.classes;
    for (let n of this.classes) {
      let a = n.instances;
      for (let i in a) n.instances[i] = this._parseProperty(a[i], n.length, i);
    }
    if (this.instancesLength = e.instancesLength, this.classIds = this._parseProperty(e.classIds, this.instancesLength, "classIds"), e.parentCounts ? this.parentCounts = this._parseProperty(e.parentCounts, this.instancesLength, "parentCounts") : this.parentCounts = Array(this.instancesLength).fill(1), e.parentIds) {
      let n = this.parentCounts.reduce((a, i) => a + i, 0);
      this.parentIds = this._parseProperty(e.parentIds, n, "parentIds");
    } else this.parentIds = null;
    this.instancesIds = [];
    let t = {};
    for (let n of this.classIds) t[n] = t[n] ?? 0, this.instancesIds.push(t[n]), t[n]++;
  }
  _parseProperty(s, e, t) {
    if (Array.isArray(s)) return s;
    {
      let { buffer: n, binOffset: a } = this.batchTable, i = s.byteOffset, r = s.componentType || "UNSIGNED_SHORT";
      return ba(n, a + i, e, "SCALAR", r, t);
    }
  }
  getDataFromId(s, e = {}) {
    let t = this.parentCounts[s];
    if (this.parentIds && t > 0) {
      let l = 0;
      for (let o = 0; o < s; o++) l += this.parentCounts[o];
      for (let o = 0; o < t; o++) {
        let c = this.parentIds[l + o];
        c !== s && this.getDataFromId(c, e);
      }
    }
    let n = this.classIds[s], a = this.classes[n].instances, i = this.classes[n].name, r = this.instancesIds[s];
    for (let l in a) e[i] = e[i] || {}, e[i][l] = a[l][r];
    return e;
  }
}, Ls = class extends Wt {
  constructor(s, e, t, n, a) {
    super(s, t, n, a), this.count = e, this.extensions = {};
    let i = this.header.extensions;
    i && i["3DTILES_batch_table_hierarchy"] && (this.extensions["3DTILES_batch_table_hierarchy"] = new Ni(this));
  }
  getDataFromId(s, e = {}) {
    if (s < 0 || s >= this.count) throw Error(`BatchTable: id value "${s}" out of bounds for "${this.count}" features number.`);
    for (let t of this.getKeys()) e[t] = super.getData(t, this.count)[s];
    for (let t in this.extensions) {
      let n = this.extensions[t];
      n.getDataFromId instanceof Function && (e[t] = e[t] || {}, n.getDataFromId(s, e[t]));
    }
    return e;
  }
  getPropertyArray(s) {
    return super.getData(s, this.count);
  }
}, Bi = class extends Zt {
  parse(s) {
    let e = new DataView(s), t = We(e);
    console.assert(t === "b3dm");
    let n = e.getUint32(4, !0);
    console.assert(n === 1);
    let a = e.getUint32(8, !0);
    console.assert(a === s.byteLength);
    let i = e.getUint32(12, !0), r = e.getUint32(16, !0), l = e.getUint32(20, !0), o = e.getUint32(24, !0), c = new Wt(s.slice(28, 28 + i + r), 0, i, r), d = 28 + i + r, u = new Ls(s.slice(d, d + l + o), c.getData("BATCH_LENGTH"), 0, l, o), h = d + l + o;
    return {
      version: n,
      featureTable: c,
      batchTable: u,
      glbBytes: new Uint8Array(s, h, a - h)
    };
  }
}, ji = class extends Zt {
  parse(s) {
    let e = new DataView(s), t = We(e);
    console.assert(t === "i3dm");
    let n = e.getUint32(4, !0);
    console.assert(n === 1);
    let a = e.getUint32(8, !0);
    console.assert(a === s.byteLength);
    let i = e.getUint32(12, !0), r = e.getUint32(16, !0), l = e.getUint32(20, !0), o = e.getUint32(24, !0), c = e.getUint32(28, !0), d = new Wt(s.slice(32, 32 + i + r), 0, i, r), u = 32 + i + r, h = new Ls(s.slice(u, u + l + o), d.getData("INSTANCES_LENGTH"), 0, l, o), f = u + l + o, p = new Uint8Array(s, f, a - f), y = null, g = null, b = null;
    if (c) y = p, g = Promise.resolve();
    else {
      let x = this.resolveExternalURL(ma(p));
      b = _s(x), g = fetch(x, this.fetchOptions).then((m) => {
        if (!m.ok) throw Error(`I3DMLoaderBase : Failed to load file "${x}" with status ${m.status} : ${m.statusText}`);
        return m.arrayBuffer();
      }).then((m) => {
        y = new Uint8Array(m);
      });
    }
    return g.then(() => ({
      version: n,
      featureTable: d,
      batchTable: h,
      glbBytes: y,
      gltfWorkingPath: b
    }));
  }
}, Ui = class extends Zt {
  parse(s) {
    let e = new DataView(s), t = We(e);
    console.assert(t === "pnts");
    let n = e.getUint32(4, !0);
    console.assert(n === 1);
    let a = e.getUint32(8, !0);
    console.assert(a === s.byteLength);
    let i = e.getUint32(12, !0), r = e.getUint32(16, !0), l = e.getUint32(20, !0), o = e.getUint32(24, !0), c = new Wt(s.slice(28, 28 + i + r), 0, i, r), d = 28 + i + r, u = new Ls(s.slice(d, d + l + o), c.getData("BATCH_LENGTH") || c.getData("POINTS_LENGTH"), 0, l, o);
    return Promise.resolve({
      version: n,
      featureTable: c,
      batchTable: u
    });
  }
}, Hi = class extends Zt {
  parse(s) {
    let e = new DataView(s), t = We(e);
    console.assert(t === "cmpt", 'CMPTLoader: The magic bytes equal "cmpt".');
    let n = e.getUint32(4, !0);
    console.assert(n === 1, 'CMPTLoader: The version listed in the header is "1".');
    let a = e.getUint32(8, !0);
    console.assert(a === s.byteLength, "CMPTLoader: The contents buffer length listed in the header matches the file.");
    let i = e.getUint32(12, !0), r = [], l = 16;
    for (let o = 0; o < i; o++) {
      let c = new DataView(s, l, 12), d = We(c), u = c.getUint32(4, !0), h = c.getUint32(8, !0), f = new Uint8Array(s, l, h);
      r.push({
        type: d,
        buffer: f,
        version: u
      }), l += h;
    }
    return {
      version: n,
      tiles: r
    };
  }
};
function Gi(s) {
  let e = 0;
  for (const n in s.attributes) {
    const a = s.getAttribute(n);
    e += a.count * a.itemSize * a.array.BYTES_PER_ELEMENT;
  }
  const t = s.getIndex();
  return e += t ? t.count * t.itemSize * t.array.BYTES_PER_ELEMENT : 0, e;
}
function Js(s, e) {
  if (e === La)
    return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."), s;
  if (e === xs || e === Yn) {
    let t = s.getIndex();
    if (t === null) {
      const r = [], l = s.getAttribute("position");
      if (l !== void 0) {
        for (let o = 0; o < l.count; o++)
          r.push(o);
        s.setIndex(r), t = s.getIndex();
      } else
        return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."), s;
    }
    const n = t.count - 2, a = [];
    if (e === xs)
      for (let r = 1; r <= n; r++)
        a.push(t.getX(0)), a.push(t.getX(r)), a.push(t.getX(r + 1));
    else
      for (let r = 0; r < n; r++)
        r % 2 === 0 ? (a.push(t.getX(r)), a.push(t.getX(r + 1)), a.push(t.getX(r + 2))) : (a.push(t.getX(r + 2)), a.push(t.getX(r + 1)), a.push(t.getX(r)));
    a.length / 3 !== n && console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");
    const i = s.clone();
    return i.setIndex(a), i.clearGroups(), i;
  } else
    return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:", e), s;
}
class Kt extends Na {
  /**
   * Constructs a new glTF loader.
   *
   * @param {LoadingManager} [manager] - The loading manager.
   */
  constructor(e) {
    super(e), this.dracoLoader = null, this.ktx2Loader = null, this.meshoptDecoder = null, this.pluginCallbacks = [], this.register(function(t) {
      return new Wi(t);
    }), this.register(function(t) {
      return new Ki(t);
    }), this.register(function(t) {
      return new ar(t);
    }), this.register(function(t) {
      return new ir(t);
    }), this.register(function(t) {
      return new rr(t);
    }), this.register(function(t) {
      return new Qi(t);
    }), this.register(function(t) {
      return new Ji(t);
    }), this.register(function(t) {
      return new $i(t);
    }), this.register(function(t) {
      return new er(t);
    }), this.register(function(t) {
      return new Zi(t);
    }), this.register(function(t) {
      return new tr(t);
    }), this.register(function(t) {
      return new Yi(t);
    }), this.register(function(t) {
      return new nr(t);
    }), this.register(function(t) {
      return new sr(t);
    }), this.register(function(t) {
      return new Xi(t);
    }), this.register(function(t) {
      return new or(t);
    }), this.register(function(t) {
      return new lr(t);
    });
  }
  /**
   * Starts loading from the given URL and passes the loaded glTF asset
   * to the `onLoad()` callback.
   *
   * @param {string} url - The path/URL of the file to be loaded. This can also be a data URI.
   * @param {function(GLTFLoader~LoadObject)} onLoad - Executed when the loading process has been finished.
   * @param {onProgressCallback} onProgress - Executed while the loading is in progress.
   * @param {onErrorCallback} onError - Executed when errors occur.
   */
  load(e, t, n, a) {
    const i = this;
    let r;
    if (this.resourcePath !== "")
      r = this.resourcePath;
    else if (this.path !== "") {
      const c = lt.extractUrlBase(e);
      r = lt.resolveURL(c, this.path);
    } else
      r = lt.extractUrlBase(e);
    this.manager.itemStart(e);
    const l = function(c) {
      a ? a(c) : console.error(c), i.manager.itemError(e), i.manager.itemEnd(e);
    }, o = new ks(this.manager);
    o.setPath(this.path), o.setResponseType("arraybuffer"), o.setRequestHeader(this.requestHeader), o.setWithCredentials(this.withCredentials), o.load(e, function(c) {
      try {
        i.parse(c, r, function(d) {
          t(d), i.manager.itemEnd(e);
        }, l);
      } catch (d) {
        l(d);
      }
    }, n, l);
  }
  /**
   * Sets the given Draco loader to this loader. Required for decoding assets
   * compressed with the `KHR_draco_mesh_compression` extension.
   *
   * @param {DRACOLoader} dracoLoader - The Draco loader to set.
   * @return {GLTFLoader} A reference to this loader.
   */
  setDRACOLoader(e) {
    return this.dracoLoader = e, this;
  }
  /**
   * Sets the given KTX2 loader to this loader. Required for loading KTX2
   * compressed textures.
   *
   * @param {KTX2Loader} ktx2Loader - The KTX2 loader to set.
   * @return {GLTFLoader} A reference to this loader.
   */
  setKTX2Loader(e) {
    return this.ktx2Loader = e, this;
  }
  /**
   * Sets the given meshopt decoder. Required for decoding assets
   * compressed with the `EXT_meshopt_compression` extension.
   *
   * @param {Object} meshoptDecoder - The meshopt decoder to set.
   * @return {GLTFLoader} A reference to this loader.
   */
  setMeshoptDecoder(e) {
    return this.meshoptDecoder = e, this;
  }
  /**
   * Registers a plugin callback. This API is internally used to implement the various
   * glTF extensions but can also used by third-party code to add additional logic
   * to the loader.
   *
   * @param {function(parser:GLTFParser)} callback - The callback function to register.
   * @return {GLTFLoader} A reference to this loader.
   */
  register(e) {
    return this.pluginCallbacks.indexOf(e) === -1 && this.pluginCallbacks.push(e), this;
  }
  /**
   * Unregisters a plugin callback.
   *
   * @param {Function} callback - The callback function to unregister.
   * @return {GLTFLoader} A reference to this loader.
   */
  unregister(e) {
    return this.pluginCallbacks.indexOf(e) !== -1 && this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e), 1), this;
  }
  /**
   * Parses the given FBX data and returns the resulting group.
   *
   * @param {string|ArrayBuffer} data - The raw glTF data.
   * @param {string} path - The URL base path.
   * @param {function(GLTFLoader~LoadObject)} onLoad - Executed when the loading process has been finished.
   * @param {onErrorCallback} onError - Executed when errors occur.
   */
  parse(e, t, n, a) {
    let i;
    const r = {}, l = {}, o = new TextDecoder();
    if (typeof e == "string")
      i = JSON.parse(e);
    else if (e instanceof ArrayBuffer)
      if (o.decode(new Uint8Array(e, 0, 4)) === ga) {
        try {
          r[H.KHR_BINARY_GLTF] = new cr(e);
        } catch (u) {
          a && a(u);
          return;
        }
        i = JSON.parse(r[H.KHR_BINARY_GLTF].content);
      } else
        i = JSON.parse(o.decode(e));
    else
      i = e;
    if (i.asset === void 0 || i.asset.version[0] < 2) {
      a && a(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));
      return;
    }
    const c = new Tr(i, {
      path: t || this.resourcePath || "",
      crossOrigin: this.crossOrigin,
      requestHeader: this.requestHeader,
      manager: this.manager,
      ktx2Loader: this.ktx2Loader,
      meshoptDecoder: this.meshoptDecoder
    });
    c.fileLoader.setRequestHeader(this.requestHeader);
    for (let d = 0; d < this.pluginCallbacks.length; d++) {
      const u = this.pluginCallbacks[d](c);
      u.name || console.error("THREE.GLTFLoader: Invalid plugin found: missing name"), l[u.name] = u, r[u.name] = !0;
    }
    if (i.extensionsUsed)
      for (let d = 0; d < i.extensionsUsed.length; ++d) {
        const u = i.extensionsUsed[d], h = i.extensionsRequired || [];
        switch (u) {
          case H.KHR_MATERIALS_UNLIT:
            r[u] = new qi();
            break;
          case H.KHR_DRACO_MESH_COMPRESSION:
            r[u] = new ur(i, this.dracoLoader);
            break;
          case H.KHR_TEXTURE_TRANSFORM:
            r[u] = new dr();
            break;
          case H.KHR_MESH_QUANTIZATION:
            r[u] = new hr();
            break;
          default:
            h.indexOf(u) >= 0 && l[u] === void 0 && console.warn('THREE.GLTFLoader: Unknown extension "' + u + '".');
        }
      }
    c.setExtensions(r), c.setPlugins(l), c.parse(n, a);
  }
  /**
   * Async version of {@link GLTFLoader#parse}.
   *
   * @async
   * @param {string|ArrayBuffer} data - The raw glTF data.
   * @param {string} path - The URL base path.
   * @return {Promise<GLTFLoader~LoadObject>} A Promise that resolves with the loaded glTF when the parsing has been finished.
   */
  parseAsync(e, t) {
    const n = this;
    return new Promise(function(a, i) {
      n.parse(e, t, a, i);
    });
  }
}
function Vi() {
  let s = {};
  return {
    get: function(e) {
      return s[e];
    },
    add: function(e, t) {
      s[e] = t;
    },
    remove: function(e) {
      delete s[e];
    },
    removeAll: function() {
      s = {};
    }
  };
}
const H = {
  KHR_BINARY_GLTF: "KHR_binary_glTF",
  KHR_DRACO_MESH_COMPRESSION: "KHR_draco_mesh_compression",
  KHR_LIGHTS_PUNCTUAL: "KHR_lights_punctual",
  KHR_MATERIALS_CLEARCOAT: "KHR_materials_clearcoat",
  KHR_MATERIALS_DISPERSION: "KHR_materials_dispersion",
  KHR_MATERIALS_IOR: "KHR_materials_ior",
  KHR_MATERIALS_SHEEN: "KHR_materials_sheen",
  KHR_MATERIALS_SPECULAR: "KHR_materials_specular",
  KHR_MATERIALS_TRANSMISSION: "KHR_materials_transmission",
  KHR_MATERIALS_IRIDESCENCE: "KHR_materials_iridescence",
  KHR_MATERIALS_ANISOTROPY: "KHR_materials_anisotropy",
  KHR_MATERIALS_UNLIT: "KHR_materials_unlit",
  KHR_MATERIALS_VOLUME: "KHR_materials_volume",
  KHR_TEXTURE_BASISU: "KHR_texture_basisu",
  KHR_TEXTURE_TRANSFORM: "KHR_texture_transform",
  KHR_MESH_QUANTIZATION: "KHR_mesh_quantization",
  KHR_MATERIALS_EMISSIVE_STRENGTH: "KHR_materials_emissive_strength",
  EXT_MATERIALS_BUMP: "EXT_materials_bump",
  EXT_TEXTURE_WEBP: "EXT_texture_webp",
  EXT_TEXTURE_AVIF: "EXT_texture_avif",
  EXT_MESHOPT_COMPRESSION: "EXT_meshopt_compression",
  EXT_MESH_GPU_INSTANCING: "EXT_mesh_gpu_instancing"
};
class Xi {
  constructor(e) {
    this.parser = e, this.name = H.KHR_LIGHTS_PUNCTUAL, this.cache = { refs: {}, uses: {} };
  }
  _markDefs() {
    const e = this.parser, t = this.parser.json.nodes || [];
    for (let n = 0, a = t.length; n < a; n++) {
      const i = t[n];
      i.extensions && i.extensions[this.name] && i.extensions[this.name].light !== void 0 && e._addNodeRef(this.cache, i.extensions[this.name].light);
    }
  }
  _loadLight(e) {
    const t = this.parser, n = "light:" + e;
    let a = t.cache.get(n);
    if (a) return a;
    const i = t.json, o = ((i.extensions && i.extensions[this.name] || {}).lights || [])[e];
    let c;
    const d = new Oe(16777215);
    o.color !== void 0 && d.setRGB(o.color[0], o.color[1], o.color[2], Se);
    const u = o.range !== void 0 ? o.range : 0;
    switch (o.type) {
      case "directional":
        c = new Ua(d), c.target.position.set(0, 0, -1), c.add(c.target);
        break;
      case "point":
        c = new ja(d), c.distance = u;
        break;
      case "spot":
        c = new Ba(d), c.distance = u, o.spot = o.spot || {}, o.spot.innerConeAngle = o.spot.innerConeAngle !== void 0 ? o.spot.innerConeAngle : 0, o.spot.outerConeAngle = o.spot.outerConeAngle !== void 0 ? o.spot.outerConeAngle : Math.PI / 4, c.angle = o.spot.outerConeAngle, c.penumbra = 1 - o.spot.innerConeAngle / o.spot.outerConeAngle, c.target.position.set(0, 0, -1), c.add(c.target);
        break;
      default:
        throw new Error("THREE.GLTFLoader: Unexpected light type: " + o.type);
    }
    return c.position.set(0, 0, 0), we(c, o), o.intensity !== void 0 && (c.intensity = o.intensity), c.name = t.createUniqueName(o.name || "light_" + e), a = Promise.resolve(c), t.cache.add(n, a), a;
  }
  getDependency(e, t) {
    if (e === "light")
      return this._loadLight(t);
  }
  createNodeAttachment(e) {
    const t = this, n = this.parser, i = n.json.nodes[e], l = (i.extensions && i.extensions[this.name] || {}).light;
    return l === void 0 ? null : this._loadLight(l).then(function(o) {
      return n._getNodeRef(t.cache, l, o);
    });
  }
}
class qi {
  constructor() {
    this.name = H.KHR_MATERIALS_UNLIT;
  }
  getMaterialType() {
    return Ve;
  }
  extendParams(e, t, n) {
    const a = [];
    e.color = new Oe(1, 1, 1), e.opacity = 1;
    const i = t.pbrMetallicRoughness;
    if (i) {
      if (Array.isArray(i.baseColorFactor)) {
        const r = i.baseColorFactor;
        e.color.setRGB(r[0], r[1], r[2], Se), e.opacity = r[3];
      }
      i.baseColorTexture !== void 0 && a.push(n.assignTexture(e, "map", i.baseColorTexture, dt));
    }
    return Promise.all(a);
  }
}
class Zi {
  constructor(e) {
    this.parser = e, this.name = H.KHR_MATERIALS_EMISSIVE_STRENGTH;
  }
  extendMaterialParams(e, t) {
    const a = this.parser.json.materials[e];
    if (!a.extensions || !a.extensions[this.name])
      return Promise.resolve();
    const i = a.extensions[this.name].emissiveStrength;
    return i !== void 0 && (t.emissiveIntensity = i), Promise.resolve();
  }
}
class Wi {
  constructor(e) {
    this.parser = e, this.name = H.KHR_MATERIALS_CLEARCOAT;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : pe;
  }
  extendMaterialParams(e, t) {
    const n = this.parser, a = n.json.materials[e];
    if (!a.extensions || !a.extensions[this.name])
      return Promise.resolve();
    const i = [], r = a.extensions[this.name];
    if (r.clearcoatFactor !== void 0 && (t.clearcoat = r.clearcoatFactor), r.clearcoatTexture !== void 0 && i.push(n.assignTexture(t, "clearcoatMap", r.clearcoatTexture)), r.clearcoatRoughnessFactor !== void 0 && (t.clearcoatRoughness = r.clearcoatRoughnessFactor), r.clearcoatRoughnessTexture !== void 0 && i.push(n.assignTexture(t, "clearcoatRoughnessMap", r.clearcoatRoughnessTexture)), r.clearcoatNormalTexture !== void 0 && (i.push(n.assignTexture(t, "clearcoatNormalMap", r.clearcoatNormalTexture)), r.clearcoatNormalTexture.scale !== void 0)) {
      const l = r.clearcoatNormalTexture.scale;
      t.clearcoatNormalScale = new se(l, l);
    }
    return Promise.all(i);
  }
}
class Ki {
  constructor(e) {
    this.parser = e, this.name = H.KHR_MATERIALS_DISPERSION;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : pe;
  }
  extendMaterialParams(e, t) {
    const a = this.parser.json.materials[e];
    if (!a.extensions || !a.extensions[this.name])
      return Promise.resolve();
    const i = a.extensions[this.name];
    return t.dispersion = i.dispersion !== void 0 ? i.dispersion : 0, Promise.resolve();
  }
}
class Yi {
  constructor(e) {
    this.parser = e, this.name = H.KHR_MATERIALS_IRIDESCENCE;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : pe;
  }
  extendMaterialParams(e, t) {
    const n = this.parser, a = n.json.materials[e];
    if (!a.extensions || !a.extensions[this.name])
      return Promise.resolve();
    const i = [], r = a.extensions[this.name];
    return r.iridescenceFactor !== void 0 && (t.iridescence = r.iridescenceFactor), r.iridescenceTexture !== void 0 && i.push(n.assignTexture(t, "iridescenceMap", r.iridescenceTexture)), r.iridescenceIor !== void 0 && (t.iridescenceIOR = r.iridescenceIor), t.iridescenceThicknessRange === void 0 && (t.iridescenceThicknessRange = [100, 400]), r.iridescenceThicknessMinimum !== void 0 && (t.iridescenceThicknessRange[0] = r.iridescenceThicknessMinimum), r.iridescenceThicknessMaximum !== void 0 && (t.iridescenceThicknessRange[1] = r.iridescenceThicknessMaximum), r.iridescenceThicknessTexture !== void 0 && i.push(n.assignTexture(t, "iridescenceThicknessMap", r.iridescenceThicknessTexture)), Promise.all(i);
  }
}
class Qi {
  constructor(e) {
    this.parser = e, this.name = H.KHR_MATERIALS_SHEEN;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : pe;
  }
  extendMaterialParams(e, t) {
    const n = this.parser, a = n.json.materials[e];
    if (!a.extensions || !a.extensions[this.name])
      return Promise.resolve();
    const i = [];
    t.sheenColor = new Oe(0, 0, 0), t.sheenRoughness = 0, t.sheen = 1;
    const r = a.extensions[this.name];
    if (r.sheenColorFactor !== void 0) {
      const l = r.sheenColorFactor;
      t.sheenColor.setRGB(l[0], l[1], l[2], Se);
    }
    return r.sheenRoughnessFactor !== void 0 && (t.sheenRoughness = r.sheenRoughnessFactor), r.sheenColorTexture !== void 0 && i.push(n.assignTexture(t, "sheenColorMap", r.sheenColorTexture, dt)), r.sheenRoughnessTexture !== void 0 && i.push(n.assignTexture(t, "sheenRoughnessMap", r.sheenRoughnessTexture)), Promise.all(i);
  }
}
class Ji {
  constructor(e) {
    this.parser = e, this.name = H.KHR_MATERIALS_TRANSMISSION;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : pe;
  }
  extendMaterialParams(e, t) {
    const n = this.parser, a = n.json.materials[e];
    if (!a.extensions || !a.extensions[this.name])
      return Promise.resolve();
    const i = [], r = a.extensions[this.name];
    return r.transmissionFactor !== void 0 && (t.transmission = r.transmissionFactor), r.transmissionTexture !== void 0 && i.push(n.assignTexture(t, "transmissionMap", r.transmissionTexture)), Promise.all(i);
  }
}
class $i {
  constructor(e) {
    this.parser = e, this.name = H.KHR_MATERIALS_VOLUME;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : pe;
  }
  extendMaterialParams(e, t) {
    const n = this.parser, a = n.json.materials[e];
    if (!a.extensions || !a.extensions[this.name])
      return Promise.resolve();
    const i = [], r = a.extensions[this.name];
    t.thickness = r.thicknessFactor !== void 0 ? r.thicknessFactor : 0, r.thicknessTexture !== void 0 && i.push(n.assignTexture(t, "thicknessMap", r.thicknessTexture)), t.attenuationDistance = r.attenuationDistance || 1 / 0;
    const l = r.attenuationColor || [1, 1, 1];
    return t.attenuationColor = new Oe().setRGB(l[0], l[1], l[2], Se), Promise.all(i);
  }
}
class er {
  constructor(e) {
    this.parser = e, this.name = H.KHR_MATERIALS_IOR;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : pe;
  }
  extendMaterialParams(e, t) {
    const a = this.parser.json.materials[e];
    if (!a.extensions || !a.extensions[this.name])
      return Promise.resolve();
    const i = a.extensions[this.name];
    return t.ior = i.ior !== void 0 ? i.ior : 1.5, Promise.resolve();
  }
}
class tr {
  constructor(e) {
    this.parser = e, this.name = H.KHR_MATERIALS_SPECULAR;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : pe;
  }
  extendMaterialParams(e, t) {
    const n = this.parser, a = n.json.materials[e];
    if (!a.extensions || !a.extensions[this.name])
      return Promise.resolve();
    const i = [], r = a.extensions[this.name];
    t.specularIntensity = r.specularFactor !== void 0 ? r.specularFactor : 1, r.specularTexture !== void 0 && i.push(n.assignTexture(t, "specularIntensityMap", r.specularTexture));
    const l = r.specularColorFactor || [1, 1, 1];
    return t.specularColor = new Oe().setRGB(l[0], l[1], l[2], Se), r.specularColorTexture !== void 0 && i.push(n.assignTexture(t, "specularColorMap", r.specularColorTexture, dt)), Promise.all(i);
  }
}
class sr {
  constructor(e) {
    this.parser = e, this.name = H.EXT_MATERIALS_BUMP;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : pe;
  }
  extendMaterialParams(e, t) {
    const n = this.parser, a = n.json.materials[e];
    if (!a.extensions || !a.extensions[this.name])
      return Promise.resolve();
    const i = [], r = a.extensions[this.name];
    return t.bumpScale = r.bumpFactor !== void 0 ? r.bumpFactor : 1, r.bumpTexture !== void 0 && i.push(n.assignTexture(t, "bumpMap", r.bumpTexture)), Promise.all(i);
  }
}
class nr {
  constructor(e) {
    this.parser = e, this.name = H.KHR_MATERIALS_ANISOTROPY;
  }
  getMaterialType(e) {
    const n = this.parser.json.materials[e];
    return !n.extensions || !n.extensions[this.name] ? null : pe;
  }
  extendMaterialParams(e, t) {
    const n = this.parser, a = n.json.materials[e];
    if (!a.extensions || !a.extensions[this.name])
      return Promise.resolve();
    const i = [], r = a.extensions[this.name];
    return r.anisotropyStrength !== void 0 && (t.anisotropy = r.anisotropyStrength), r.anisotropyRotation !== void 0 && (t.anisotropyRotation = r.anisotropyRotation), r.anisotropyTexture !== void 0 && i.push(n.assignTexture(t, "anisotropyMap", r.anisotropyTexture)), Promise.all(i);
  }
}
class ar {
  constructor(e) {
    this.parser = e, this.name = H.KHR_TEXTURE_BASISU;
  }
  loadTexture(e) {
    const t = this.parser, n = t.json, a = n.textures[e];
    if (!a.extensions || !a.extensions[this.name])
      return null;
    const i = a.extensions[this.name], r = t.options.ktx2Loader;
    if (!r) {
      if (n.extensionsRequired && n.extensionsRequired.indexOf(this.name) >= 0)
        throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");
      return null;
    }
    return t.loadTextureImage(e, i.source, r);
  }
}
class ir {
  constructor(e) {
    this.parser = e, this.name = H.EXT_TEXTURE_WEBP;
  }
  loadTexture(e) {
    const t = this.name, n = this.parser, a = n.json, i = a.textures[e];
    if (!i.extensions || !i.extensions[t])
      return null;
    const r = i.extensions[t], l = a.images[r.source];
    let o = n.textureLoader;
    if (l.uri) {
      const c = n.options.manager.getHandler(l.uri);
      c !== null && (o = c);
    }
    return n.loadTextureImage(e, r.source, o);
  }
}
class rr {
  constructor(e) {
    this.parser = e, this.name = H.EXT_TEXTURE_AVIF;
  }
  loadTexture(e) {
    const t = this.name, n = this.parser, a = n.json, i = a.textures[e];
    if (!i.extensions || !i.extensions[t])
      return null;
    const r = i.extensions[t], l = a.images[r.source];
    let o = n.textureLoader;
    if (l.uri) {
      const c = n.options.manager.getHandler(l.uri);
      c !== null && (o = c);
    }
    return n.loadTextureImage(e, r.source, o);
  }
}
class or {
  constructor(e) {
    this.name = H.EXT_MESHOPT_COMPRESSION, this.parser = e;
  }
  loadBufferView(e) {
    const t = this.parser.json, n = t.bufferViews[e];
    if (n.extensions && n.extensions[this.name]) {
      const a = n.extensions[this.name], i = this.parser.getDependency("buffer", a.buffer), r = this.parser.options.meshoptDecoder;
      if (!r || !r.supported) {
        if (t.extensionsRequired && t.extensionsRequired.indexOf(this.name) >= 0)
          throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");
        return null;
      }
      return i.then(function(l) {
        const o = a.byteOffset || 0, c = a.byteLength || 0, d = a.count, u = a.byteStride, h = new Uint8Array(l, o, c);
        return r.decodeGltfBufferAsync ? r.decodeGltfBufferAsync(d, u, h, a.mode, a.filter).then(function(f) {
          return f.buffer;
        }) : r.ready.then(function() {
          const f = new ArrayBuffer(d * u);
          return r.decodeGltfBuffer(new Uint8Array(f), d, u, h, a.mode, a.filter), f;
        });
      });
    } else
      return null;
  }
}
class lr {
  constructor(e) {
    this.name = H.EXT_MESH_GPU_INSTANCING, this.parser = e;
  }
  createNodeMesh(e) {
    const t = this.parser.json, n = t.nodes[e];
    if (!n.extensions || !n.extensions[this.name] || n.mesh === void 0)
      return null;
    const a = t.meshes[n.mesh];
    for (const c of a.primitives)
      if (c.mode !== ue.TRIANGLES && c.mode !== ue.TRIANGLE_STRIP && c.mode !== ue.TRIANGLE_FAN && c.mode !== void 0)
        return null;
    const r = n.extensions[this.name].attributes, l = [], o = {};
    for (const c in r)
      l.push(this.parser.getDependency("accessor", r[c]).then((d) => (o[c] = d, o[c])));
    return l.length < 1 ? null : (l.push(this.parser.createNodeMesh(e)), Promise.all(l).then((c) => {
      const d = c.pop(), u = d.isGroup ? d.children : [d], h = c[0].count, f = [];
      for (const p of u) {
        const y = new W(), g = new B(), b = new Ht(), x = new B(1, 1, 1), m = new Qn(p.geometry, p.material, h);
        for (let v = 0; v < h; v++)
          o.TRANSLATION && g.fromBufferAttribute(o.TRANSLATION, v), o.ROTATION && b.fromBufferAttribute(o.ROTATION, v), o.SCALE && x.fromBufferAttribute(o.SCALE, v), m.setMatrixAt(v, y.compose(g, b, x));
        for (const v in o)
          if (v === "_COLOR_0") {
            const w = o[v];
            m.instanceColor = new Ha(w.array, w.itemSize, w.normalized);
          } else v !== "TRANSLATION" && v !== "ROTATION" && v !== "SCALE" && p.geometry.setAttribute(v, o[v]);
        Jn.prototype.copy.call(m, p), this.parser.assignFinalMaterial(m), f.push(m);
      }
      return d.isGroup ? (d.clear(), d.add(...f), d) : f[0];
    }));
  }
}
const ga = "glTF", Ye = 12, $s = { JSON: 1313821514, BIN: 5130562 };
class cr {
  constructor(e) {
    this.name = H.KHR_BINARY_GLTF, this.content = null, this.body = null;
    const t = new DataView(e, 0, Ye), n = new TextDecoder();
    if (this.header = {
      magic: n.decode(new Uint8Array(e.slice(0, 4))),
      version: t.getUint32(4, !0),
      length: t.getUint32(8, !0)
    }, this.header.magic !== ga)
      throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");
    if (this.header.version < 2)
      throw new Error("THREE.GLTFLoader: Legacy binary file detected.");
    const a = this.header.length - Ye, i = new DataView(e, Ye);
    let r = 0;
    for (; r < a; ) {
      const l = i.getUint32(r, !0);
      r += 4;
      const o = i.getUint32(r, !0);
      if (r += 4, o === $s.JSON) {
        const c = new Uint8Array(e, Ye + r, l);
        this.content = n.decode(c);
      } else if (o === $s.BIN) {
        const c = Ye + r;
        this.body = e.slice(c, c + l);
      }
      r += l;
    }
    if (this.content === null)
      throw new Error("THREE.GLTFLoader: JSON content not found.");
  }
}
class ur {
  constructor(e, t) {
    if (!t)
      throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");
    this.name = H.KHR_DRACO_MESH_COMPRESSION, this.json = e, this.dracoLoader = t, this.dracoLoader.preload();
  }
  decodePrimitive(e, t) {
    const n = this.json, a = this.dracoLoader, i = e.extensions[this.name].bufferView, r = e.extensions[this.name].attributes, l = {}, o = {}, c = {};
    for (const d in r) {
      const u = ws[d] || d.toLowerCase();
      l[u] = r[d];
    }
    for (const d in e.attributes) {
      const u = ws[d] || d.toLowerCase();
      if (r[d] !== void 0) {
        const h = n.accessors[e.attributes[d]], f = qe[h.componentType];
        c[u] = f.name, o[u] = h.normalized === !0;
      }
    }
    return t.getDependency("bufferView", i).then(function(d) {
      return new Promise(function(u, h) {
        a.decodeDracoFile(d, function(f) {
          for (const p in f.attributes) {
            const y = f.attributes[p], g = o[p];
            g !== void 0 && (y.normalized = g);
          }
          u(f);
        }, l, c, Se, h);
      });
    });
  }
}
class dr {
  constructor() {
    this.name = H.KHR_TEXTURE_TRANSFORM;
  }
  extendTexture(e, t) {
    return (t.texCoord === void 0 || t.texCoord === e.channel) && t.offset === void 0 && t.rotation === void 0 && t.scale === void 0 || (e = e.clone(), t.texCoord !== void 0 && (e.channel = t.texCoord), t.offset !== void 0 && e.offset.fromArray(t.offset), t.rotation !== void 0 && (e.rotation = t.rotation), t.scale !== void 0 && e.repeat.fromArray(t.scale), e.needsUpdate = !0), e;
  }
}
class hr {
  constructor() {
    this.name = H.KHR_MESH_QUANTIZATION;
  }
}
class xa extends di {
  constructor(e, t, n, a) {
    super(e, t, n, a);
  }
  copySampleValue_(e) {
    const t = this.resultBuffer, n = this.sampleValues, a = this.valueSize, i = e * a * 3 + a;
    for (let r = 0; r !== a; r++)
      t[r] = n[i + r];
    return t;
  }
  interpolate_(e, t, n, a) {
    const i = this.resultBuffer, r = this.sampleValues, l = this.valueSize, o = l * 2, c = l * 3, d = a - t, u = (n - t) / d, h = u * u, f = h * u, p = e * c, y = p - c, g = -2 * f + 3 * h, b = f - h, x = 1 - g, m = b - h + u;
    for (let v = 0; v !== l; v++) {
      const w = r[y + v + l], T = r[y + v + o] * d, M = r[p + v + l], S = r[p + v] * d;
      i[v] = x * w + m * T + g * M + b * S;
    }
    return i;
  }
}
const fr = new Ht();
class pr extends xa {
  interpolate_(e, t, n, a) {
    const i = super.interpolate_(e, t, n, a);
    return fr.fromArray(i).normalize().toArray(i), i;
  }
}
const ue = {
  POINTS: 0,
  LINES: 1,
  LINE_LOOP: 2,
  LINE_STRIP: 3,
  TRIANGLES: 4,
  TRIANGLE_STRIP: 5,
  TRIANGLE_FAN: 6
}, qe = {
  5120: Int8Array,
  5121: Uint8Array,
  5122: Int16Array,
  5123: Uint16Array,
  5125: Uint32Array,
  5126: Float32Array
}, en = {
  9728: ea,
  9729: Dt,
  9984: Ka,
  9985: Wa,
  9986: Za,
  9987: $n
}, tn = {
  33071: Qa,
  33648: Ya,
  10497: ys
}, $t = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16
}, ws = {
  POSITION: "position",
  NORMAL: "normal",
  TANGENT: "tangent",
  TEXCOORD_0: "uv",
  TEXCOORD_1: "uv1",
  TEXCOORD_2: "uv2",
  TEXCOORD_3: "uv3",
  COLOR_0: "color",
  WEIGHTS_0: "skinWeight",
  JOINTS_0: "skinIndex"
}, Ee = {
  scale: "scale",
  translation: "position",
  rotation: "quaternion",
  weights: "morphTargetInfluences"
}, mr = {
  CUBICSPLINE: void 0,
  // We use a custom interpolant (GLTFCubicSplineInterpolation) for CUBICSPLINE tracks. Each
  // keyframe track will be initialized with a default interpolation type, then modified.
  LINEAR: ra,
  STEP: ci
}, es = {
  OPAQUE: "OPAQUE",
  MASK: "MASK",
  BLEND: "BLEND"
};
function br(s) {
  return s.DefaultMaterial === void 0 && (s.DefaultMaterial = new sa({
    color: 16777215,
    emissive: 0,
    metalness: 1,
    roughness: 1,
    transparent: !1,
    depthTest: !0,
    side: ui
  })), s.DefaultMaterial;
}
function ze(s, e, t) {
  for (const n in t.extensions)
    s[n] === void 0 && (e.userData.gltfExtensions = e.userData.gltfExtensions || {}, e.userData.gltfExtensions[n] = t.extensions[n]);
}
function we(s, e) {
  e.extras !== void 0 && (typeof e.extras == "object" ? Object.assign(s.userData, e.extras) : console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, " + e.extras));
}
function gr(s, e, t) {
  let n = !1, a = !1, i = !1;
  for (let c = 0, d = e.length; c < d; c++) {
    const u = e[c];
    if (u.POSITION !== void 0 && (n = !0), u.NORMAL !== void 0 && (a = !0), u.COLOR_0 !== void 0 && (i = !0), n && a && i) break;
  }
  if (!n && !a && !i) return Promise.resolve(s);
  const r = [], l = [], o = [];
  for (let c = 0, d = e.length; c < d; c++) {
    const u = e[c];
    if (n) {
      const h = u.POSITION !== void 0 ? t.getDependency("accessor", u.POSITION) : s.attributes.position;
      r.push(h);
    }
    if (a) {
      const h = u.NORMAL !== void 0 ? t.getDependency("accessor", u.NORMAL) : s.attributes.normal;
      l.push(h);
    }
    if (i) {
      const h = u.COLOR_0 !== void 0 ? t.getDependency("accessor", u.COLOR_0) : s.attributes.color;
      o.push(h);
    }
  }
  return Promise.all([
    Promise.all(r),
    Promise.all(l),
    Promise.all(o)
  ]).then(function(c) {
    const d = c[0], u = c[1], h = c[2];
    return n && (s.morphAttributes.position = d), a && (s.morphAttributes.normal = u), i && (s.morphAttributes.color = h), s.morphTargetsRelative = !0, s;
  });
}
function xr(s, e) {
  if (s.updateMorphTargets(), e.weights !== void 0)
    for (let t = 0, n = e.weights.length; t < n; t++)
      s.morphTargetInfluences[t] = e.weights[t];
  if (e.extras && Array.isArray(e.extras.targetNames)) {
    const t = e.extras.targetNames;
    if (s.morphTargetInfluences.length === t.length) {
      s.morphTargetDictionary = {};
      for (let n = 0, a = t.length; n < a; n++)
        s.morphTargetDictionary[t[n]] = n;
    } else
      console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.");
  }
}
function yr(s) {
  let e;
  const t = s.extensions && s.extensions[H.KHR_DRACO_MESH_COMPRESSION];
  if (t ? e = "draco:" + t.bufferView + ":" + t.indices + ":" + ts(t.attributes) : e = s.indices + ":" + ts(s.attributes) + ":" + s.mode, s.targets !== void 0)
    for (let n = 0, a = s.targets.length; n < a; n++)
      e += ":" + ts(s.targets[n]);
  return e;
}
function ts(s) {
  let e = "";
  const t = Object.keys(s).sort();
  for (let n = 0, a = t.length; n < a; n++)
    e += t[n] + ":" + s[t[n]] + ";";
  return e;
}
function Ts(s) {
  switch (s) {
    case Int8Array:
      return 1 / 127;
    case Uint8Array:
      return 1 / 255;
    case Int16Array:
      return 1 / 32767;
    case Uint16Array:
      return 1 / 65535;
    default:
      throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.");
  }
}
function vr(s) {
  return s.search(/\.jpe?g($|\?)/i) > 0 || s.search(/^data\:image\/jpeg/) === 0 ? "image/jpeg" : s.search(/\.webp($|\?)/i) > 0 || s.search(/^data\:image\/webp/) === 0 ? "image/webp" : s.search(/\.ktx2($|\?)/i) > 0 || s.search(/^data\:image\/ktx2/) === 0 ? "image/ktx2" : "image/png";
}
const wr = new W();
class Tr {
  constructor(e = {}, t = {}) {
    this.json = e, this.extensions = {}, this.plugins = {}, this.options = t, this.cache = new Vi(), this.associations = /* @__PURE__ */ new Map(), this.primitiveCache = {}, this.nodeCache = {}, this.meshCache = { refs: {}, uses: {} }, this.cameraCache = { refs: {}, uses: {} }, this.lightCache = { refs: {}, uses: {} }, this.sourceCache = {}, this.textureCache = {}, this.nodeNamesUsed = {};
    let n = !1, a = -1, i = !1, r = -1;
    if (typeof navigator < "u") {
      const l = navigator.userAgent;
      n = /^((?!chrome|android).)*safari/i.test(l) === !0;
      const o = l.match(/Version\/(\d+)/);
      a = n && o ? parseInt(o[1], 10) : -1, i = l.indexOf("Firefox") > -1, r = i ? l.match(/Firefox\/([0-9]+)\./)[1] : -1;
    }
    typeof createImageBitmap > "u" || n && a < 17 || i && r < 98 ? this.textureLoader = new Ga(this.options.manager) : this.textureLoader = new Va(this.options.manager), this.textureLoader.setCrossOrigin(this.options.crossOrigin), this.textureLoader.setRequestHeader(this.options.requestHeader), this.fileLoader = new ks(this.options.manager), this.fileLoader.setResponseType("arraybuffer"), this.options.crossOrigin === "use-credentials" && this.fileLoader.setWithCredentials(!0);
  }
  setExtensions(e) {
    this.extensions = e;
  }
  setPlugins(e) {
    this.plugins = e;
  }
  parse(e, t) {
    const n = this, a = this.json, i = this.extensions;
    this.cache.removeAll(), this.nodeCache = {}, this._invokeAll(function(r) {
      return r._markDefs && r._markDefs();
    }), Promise.all(this._invokeAll(function(r) {
      return r.beforeRoot && r.beforeRoot();
    })).then(function() {
      return Promise.all([
        n.getDependencies("scene"),
        n.getDependencies("animation"),
        n.getDependencies("camera")
      ]);
    }).then(function(r) {
      const l = {
        scene: r[0][a.scene || 0],
        scenes: r[0],
        animations: r[1],
        cameras: r[2],
        asset: a.asset,
        parser: n,
        userData: {}
      };
      return ze(i, l, a), we(l, a), Promise.all(n._invokeAll(function(o) {
        return o.afterRoot && o.afterRoot(l);
      })).then(function() {
        for (const o of l.scenes)
          o.updateMatrixWorld();
        e(l);
      });
    }).catch(t);
  }
  /**
   * Marks the special nodes/meshes in json for efficient parse.
   *
   * @private
   */
  _markDefs() {
    const e = this.json.nodes || [], t = this.json.skins || [], n = this.json.meshes || [];
    for (let a = 0, i = t.length; a < i; a++) {
      const r = t[a].joints;
      for (let l = 0, o = r.length; l < o; l++)
        e[r[l]].isBone = !0;
    }
    for (let a = 0, i = e.length; a < i; a++) {
      const r = e[a];
      r.mesh !== void 0 && (this._addNodeRef(this.meshCache, r.mesh), r.skin !== void 0 && (n[r.mesh].isSkinnedMesh = !0)), r.camera !== void 0 && this._addNodeRef(this.cameraCache, r.camera);
    }
  }
  /**
   * Counts references to shared node / Object3D resources. These resources
   * can be reused, or "instantiated", at multiple nodes in the scene
   * hierarchy. Mesh, Camera, and Light instances are instantiated and must
   * be marked. Non-scenegraph resources (like Materials, Geometries, and
   * Textures) can be reused directly and are not marked here.
   *
   * Example: CesiumMilkTruck sample model reuses "Wheel" meshes.
   *
   * @private
   * @param {Object} cache
   * @param {Object3D} index
   */
  _addNodeRef(e, t) {
    t !== void 0 && (e.refs[t] === void 0 && (e.refs[t] = e.uses[t] = 0), e.refs[t]++);
  }
  /**
   * Returns a reference to a shared resource, cloning it if necessary.
   *
   * @private
   * @param {Object} cache
   * @param {number} index
   * @param {Object} object
   * @return {Object}
   */
  _getNodeRef(e, t, n) {
    if (e.refs[t] <= 1) return n;
    const a = n.clone(), i = (r, l) => {
      const o = this.associations.get(r);
      o != null && this.associations.set(l, o);
      for (const [c, d] of r.children.entries())
        i(d, l.children[c]);
    };
    return i(n, a), a.name += "_instance_" + e.uses[t]++, a;
  }
  _invokeOne(e) {
    const t = Object.values(this.plugins);
    t.push(this);
    for (let n = 0; n < t.length; n++) {
      const a = e(t[n]);
      if (a) return a;
    }
    return null;
  }
  _invokeAll(e) {
    const t = Object.values(this.plugins);
    t.unshift(this);
    const n = [];
    for (let a = 0; a < t.length; a++) {
      const i = e(t[a]);
      i && n.push(i);
    }
    return n;
  }
  /**
   * Requests the specified dependency asynchronously, with caching.
   *
   * @private
   * @param {string} type
   * @param {number} index
   * @return {Promise<Object3D|Material|THREE.Texture|AnimationClip|ArrayBuffer|Object>}
   */
  getDependency(e, t) {
    const n = e + ":" + t;
    let a = this.cache.get(n);
    if (!a) {
      switch (e) {
        case "scene":
          a = this.loadScene(t);
          break;
        case "node":
          a = this._invokeOne(function(i) {
            return i.loadNode && i.loadNode(t);
          });
          break;
        case "mesh":
          a = this._invokeOne(function(i) {
            return i.loadMesh && i.loadMesh(t);
          });
          break;
        case "accessor":
          a = this.loadAccessor(t);
          break;
        case "bufferView":
          a = this._invokeOne(function(i) {
            return i.loadBufferView && i.loadBufferView(t);
          });
          break;
        case "buffer":
          a = this.loadBuffer(t);
          break;
        case "material":
          a = this._invokeOne(function(i) {
            return i.loadMaterial && i.loadMaterial(t);
          });
          break;
        case "texture":
          a = this._invokeOne(function(i) {
            return i.loadTexture && i.loadTexture(t);
          });
          break;
        case "skin":
          a = this.loadSkin(t);
          break;
        case "animation":
          a = this._invokeOne(function(i) {
            return i.loadAnimation && i.loadAnimation(t);
          });
          break;
        case "camera":
          a = this.loadCamera(t);
          break;
        default:
          if (a = this._invokeOne(function(i) {
            return i != this && i.getDependency && i.getDependency(e, t);
          }), !a)
            throw new Error("Unknown type: " + e);
          break;
      }
      this.cache.add(n, a);
    }
    return a;
  }
  /**
   * Requests all dependencies of the specified type asynchronously, with caching.
   *
   * @private
   * @param {string} type
   * @return {Promise<Array<Object>>}
   */
  getDependencies(e) {
    let t = this.cache.get(e);
    if (!t) {
      const n = this, a = this.json[e + (e === "mesh" ? "es" : "s")] || [];
      t = Promise.all(a.map(function(i, r) {
        return n.getDependency(e, r);
      })), this.cache.add(e, t);
    }
    return t;
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
   *
   * @private
   * @param {number} bufferIndex
   * @return {Promise<ArrayBuffer>}
   */
  loadBuffer(e) {
    const t = this.json.buffers[e], n = this.fileLoader;
    if (t.type && t.type !== "arraybuffer")
      throw new Error("THREE.GLTFLoader: " + t.type + " buffer type is not supported.");
    if (t.uri === void 0 && e === 0)
      return Promise.resolve(this.extensions[H.KHR_BINARY_GLTF].body);
    const a = this.options;
    return new Promise(function(i, r) {
      n.load(lt.resolveURL(t.uri, a.path), i, void 0, function() {
        r(new Error('THREE.GLTFLoader: Failed to load buffer "' + t.uri + '".'));
      });
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
   *
   * @private
   * @param {number} bufferViewIndex
   * @return {Promise<ArrayBuffer>}
   */
  loadBufferView(e) {
    const t = this.json.bufferViews[e];
    return this.getDependency("buffer", t.buffer).then(function(n) {
      const a = t.byteLength || 0, i = t.byteOffset || 0;
      return n.slice(i, i + a);
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#accessors
   *
   * @private
   * @param {number} accessorIndex
   * @return {Promise<BufferAttribute|InterleavedBufferAttribute>}
   */
  loadAccessor(e) {
    const t = this, n = this.json, a = this.json.accessors[e];
    if (a.bufferView === void 0 && a.sparse === void 0) {
      const r = $t[a.type], l = qe[a.componentType], o = a.normalized === !0, c = new l(a.count * r);
      return Promise.resolve(new le(c, r, o));
    }
    const i = [];
    return a.bufferView !== void 0 ? i.push(this.getDependency("bufferView", a.bufferView)) : i.push(null), a.sparse !== void 0 && (i.push(this.getDependency("bufferView", a.sparse.indices.bufferView)), i.push(this.getDependency("bufferView", a.sparse.values.bufferView))), Promise.all(i).then(function(r) {
      const l = r[0], o = $t[a.type], c = qe[a.componentType], d = c.BYTES_PER_ELEMENT, u = d * o, h = a.byteOffset || 0, f = a.bufferView !== void 0 ? n.bufferViews[a.bufferView].byteStride : void 0, p = a.normalized === !0;
      let y, g;
      if (f && f !== u) {
        const b = Math.floor(h / f), x = "InterleavedBuffer:" + a.bufferView + ":" + a.componentType + ":" + b + ":" + a.count;
        let m = t.cache.get(x);
        m || (y = new c(l, b * f, a.count * f / d), m = new Xa(y, f / d), t.cache.add(x, m)), g = new qa(m, o, h % f / d, p);
      } else
        l === null ? y = new c(a.count * o) : y = new c(l, h, a.count * o), g = new le(y, o, p);
      if (a.sparse !== void 0) {
        const b = $t.SCALAR, x = qe[a.sparse.indices.componentType], m = a.sparse.indices.byteOffset || 0, v = a.sparse.values.byteOffset || 0, w = new x(r[1], m, a.sparse.count * b), T = new c(r[2], v, a.sparse.count * o);
        l !== null && (g = new le(g.array.slice(), g.itemSize, g.normalized)), g.normalized = !1;
        for (let M = 0, S = w.length; M < S; M++) {
          const R = w[M];
          if (g.setX(R, T[M * o]), o >= 2 && g.setY(R, T[M * o + 1]), o >= 3 && g.setZ(R, T[M * o + 2]), o >= 4 && g.setW(R, T[M * o + 3]), o >= 5) throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.");
        }
        g.normalized = p;
      }
      return g;
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#textures
   *
   * @private
   * @param {number} textureIndex
   * @return {Promise<THREE.Texture|null>}
   */
  loadTexture(e) {
    const t = this.json, n = this.options, i = t.textures[e].source, r = t.images[i];
    let l = this.textureLoader;
    if (r.uri) {
      const o = n.manager.getHandler(r.uri);
      o !== null && (l = o);
    }
    return this.loadTextureImage(e, i, l);
  }
  loadTextureImage(e, t, n) {
    const a = this, i = this.json, r = i.textures[e], l = i.images[t], o = (l.uri || l.bufferView) + ":" + r.sampler;
    if (this.textureCache[o])
      return this.textureCache[o];
    const c = this.loadImageSource(t, n).then(function(d) {
      d.flipY = !1, d.name = r.name || l.name || "", d.name === "" && typeof l.uri == "string" && l.uri.startsWith("data:image/") === !1 && (d.name = l.uri);
      const h = (i.samplers || {})[r.sampler] || {};
      return d.magFilter = en[h.magFilter] || Dt, d.minFilter = en[h.minFilter] || $n, d.wrapS = tn[h.wrapS] || ys, d.wrapT = tn[h.wrapT] || ys, d.generateMipmaps = !d.isCompressedTexture && d.minFilter !== ea && d.minFilter !== Dt, a.associations.set(d, { textures: e }), d;
    }).catch(function() {
      return null;
    });
    return this.textureCache[o] = c, c;
  }
  loadImageSource(e, t) {
    const n = this, a = this.json, i = this.options;
    if (this.sourceCache[e] !== void 0)
      return this.sourceCache[e].then((u) => u.clone());
    const r = a.images[e], l = self.URL || self.webkitURL;
    let o = r.uri || "", c = !1;
    if (r.bufferView !== void 0)
      o = n.getDependency("bufferView", r.bufferView).then(function(u) {
        c = !0;
        const h = new Blob([u], { type: r.mimeType });
        return o = l.createObjectURL(h), o;
      });
    else if (r.uri === void 0)
      throw new Error("THREE.GLTFLoader: Image " + e + " is missing URI and bufferView");
    const d = Promise.resolve(o).then(function(u) {
      return new Promise(function(h, f) {
        let p = h;
        t.isImageBitmapLoader === !0 && (p = function(y) {
          const g = new js(y);
          g.needsUpdate = !0, h(g);
        }), t.load(lt.resolveURL(u, i.path), p, void 0, f);
      });
    }).then(function(u) {
      return c === !0 && l.revokeObjectURL(o), we(u, r), u.userData.mimeType = r.mimeType || vr(r.uri), u;
    }).catch(function(u) {
      throw console.error("THREE.GLTFLoader: Couldn't load texture", o), u;
    });
    return this.sourceCache[e] = d, d;
  }
  /**
   * Asynchronously assigns a texture to the given material parameters.
   *
   * @private
   * @param {Object} materialParams
   * @param {string} mapName
   * @param {Object} mapDef
   * @param {string} [colorSpace]
   * @return {Promise<Texture>}
   */
  assignTexture(e, t, n, a) {
    const i = this;
    return this.getDependency("texture", n.index).then(function(r) {
      if (!r) return null;
      if (n.texCoord !== void 0 && n.texCoord > 0 && (r = r.clone(), r.channel = n.texCoord), i.extensions[H.KHR_TEXTURE_TRANSFORM]) {
        const l = n.extensions !== void 0 ? n.extensions[H.KHR_TEXTURE_TRANSFORM] : void 0;
        if (l) {
          const o = i.associations.get(r);
          r = i.extensions[H.KHR_TEXTURE_TRANSFORM].extendTexture(r, l), i.associations.set(r, o);
        }
      }
      return a !== void 0 && (r.colorSpace = a), e[t] = r, r;
    });
  }
  /**
   * Assigns final material to a Mesh, Line, or Points instance. The instance
   * already has a material (generated from the glTF material options alone)
   * but reuse of the same glTF material may require multiple threejs materials
   * to accommodate different primitive types, defines, etc. New materials will
   * be created if necessary, and reused from a cache.
   *
   * @private
   * @param {Object3D} mesh Mesh, Line, or Points instance.
   */
  assignFinalMaterial(e) {
    const t = e.geometry;
    let n = e.material;
    const a = t.attributes.tangent === void 0, i = t.attributes.color !== void 0, r = t.attributes.normal === void 0;
    if (e.isPoints) {
      const l = "PointsMaterial:" + n.uuid;
      let o = this.cache.get(l);
      o || (o = new ta(), Jt.prototype.copy.call(o, n), o.color.copy(n.color), o.map = n.map, o.sizeAttenuation = !1, this.cache.add(l, o)), n = o;
    } else if (e.isLine) {
      const l = "LineBasicMaterial:" + n.uuid;
      let o = this.cache.get(l);
      o || (o = new Ja(), Jt.prototype.copy.call(o, n), o.color.copy(n.color), o.map = n.map, this.cache.add(l, o)), n = o;
    }
    if (a || i || r) {
      let l = "ClonedMaterial:" + n.uuid + ":";
      a && (l += "derivative-tangents:"), i && (l += "vertex-colors:"), r && (l += "flat-shading:");
      let o = this.cache.get(l);
      o || (o = n.clone(), i && (o.vertexColors = !0), r && (o.flatShading = !0), a && (o.normalScale && (o.normalScale.y *= -1), o.clearcoatNormalScale && (o.clearcoatNormalScale.y *= -1)), this.cache.add(l, o), this.associations.set(o, this.associations.get(n))), n = o;
    }
    e.material = n;
  }
  getMaterialType() {
    return sa;
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#materials
   *
   * @private
   * @param {number} materialIndex
   * @return {Promise<Material>}
   */
  loadMaterial(e) {
    const t = this, n = this.json, a = this.extensions, i = n.materials[e];
    let r;
    const l = {}, o = i.extensions || {}, c = [];
    if (o[H.KHR_MATERIALS_UNLIT]) {
      const u = a[H.KHR_MATERIALS_UNLIT];
      r = u.getMaterialType(), c.push(u.extendParams(l, i, t));
    } else {
      const u = i.pbrMetallicRoughness || {};
      if (l.color = new Oe(1, 1, 1), l.opacity = 1, Array.isArray(u.baseColorFactor)) {
        const h = u.baseColorFactor;
        l.color.setRGB(h[0], h[1], h[2], Se), l.opacity = h[3];
      }
      u.baseColorTexture !== void 0 && c.push(t.assignTexture(l, "map", u.baseColorTexture, dt)), l.metalness = u.metallicFactor !== void 0 ? u.metallicFactor : 1, l.roughness = u.roughnessFactor !== void 0 ? u.roughnessFactor : 1, u.metallicRoughnessTexture !== void 0 && (c.push(t.assignTexture(l, "metalnessMap", u.metallicRoughnessTexture)), c.push(t.assignTexture(l, "roughnessMap", u.metallicRoughnessTexture))), r = this._invokeOne(function(h) {
        return h.getMaterialType && h.getMaterialType(e);
      }), c.push(Promise.all(this._invokeAll(function(h) {
        return h.extendMaterialParams && h.extendMaterialParams(e, l);
      })));
    }
    i.doubleSided === !0 && (l.side = $a);
    const d = i.alphaMode || es.OPAQUE;
    if (d === es.BLEND ? (l.transparent = !0, l.depthWrite = !1) : (l.transparent = !1, d === es.MASK && (l.alphaTest = i.alphaCutoff !== void 0 ? i.alphaCutoff : 0.5)), i.normalTexture !== void 0 && r !== Ve && (c.push(t.assignTexture(l, "normalMap", i.normalTexture)), l.normalScale = new se(1, 1), i.normalTexture.scale !== void 0)) {
      const u = i.normalTexture.scale;
      l.normalScale.set(u, u);
    }
    if (i.occlusionTexture !== void 0 && r !== Ve && (c.push(t.assignTexture(l, "aoMap", i.occlusionTexture)), i.occlusionTexture.strength !== void 0 && (l.aoMapIntensity = i.occlusionTexture.strength)), i.emissiveFactor !== void 0 && r !== Ve) {
      const u = i.emissiveFactor;
      l.emissive = new Oe().setRGB(u[0], u[1], u[2], Se);
    }
    return i.emissiveTexture !== void 0 && r !== Ve && c.push(t.assignTexture(l, "emissiveMap", i.emissiveTexture, dt)), Promise.all(c).then(function() {
      const u = new r(l);
      return i.name && (u.name = i.name), we(u, i), t.associations.set(u, { materials: e }), i.extensions && ze(a, u, i), u;
    });
  }
  /**
   * When Object3D instances are targeted by animation, they need unique names.
   *
   * @private
   * @param {string} originalName
   * @return {string}
   */
  createUniqueName(e) {
    const t = ei.sanitizeNodeName(e || "");
    return t in this.nodeNamesUsed ? t + "_" + ++this.nodeNamesUsed[t] : (this.nodeNamesUsed[t] = 0, t);
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#geometry
   *
   * Creates BufferGeometries from primitives.
   *
   * @private
   * @param {Array<GLTF.Primitive>} primitives
   * @return {Promise<Array<BufferGeometry>>}
   */
  loadGeometries(e) {
    const t = this, n = this.extensions, a = this.primitiveCache;
    function i(l) {
      return n[H.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(l, t).then(function(o) {
        return sn(o, l, t);
      });
    }
    const r = [];
    for (let l = 0, o = e.length; l < o; l++) {
      const c = e[l], d = yr(c), u = a[d];
      if (u)
        r.push(u.promise);
      else {
        let h;
        c.extensions && c.extensions[H.KHR_DRACO_MESH_COMPRESSION] ? h = i(c) : h = sn(new Os(), c, t), a[d] = { primitive: c, promise: h }, r.push(h);
      }
    }
    return Promise.all(r);
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#meshes
   *
   * @private
   * @param {number} meshIndex
   * @return {Promise<Group|Mesh|SkinnedMesh|Line|Points>}
   */
  loadMesh(e) {
    const t = this, n = this.json, a = this.extensions, i = n.meshes[e], r = i.primitives, l = [];
    for (let o = 0, c = r.length; o < c; o++) {
      const d = r[o].material === void 0 ? br(this.cache) : this.getDependency("material", r[o].material);
      l.push(d);
    }
    return l.push(t.loadGeometries(r)), Promise.all(l).then(function(o) {
      const c = o.slice(0, o.length - 1), d = o[o.length - 1], u = [];
      for (let f = 0, p = d.length; f < p; f++) {
        const y = d[f], g = r[f];
        let b;
        const x = c[f];
        if (g.mode === ue.TRIANGLES || g.mode === ue.TRIANGLE_STRIP || g.mode === ue.TRIANGLE_FAN || g.mode === void 0)
          b = i.isSkinnedMesh === !0 ? new ti(y, x) : new na(y, x), b.isSkinnedMesh === !0 && b.normalizeSkinWeights(), g.mode === ue.TRIANGLE_STRIP ? b.geometry = Js(b.geometry, Yn) : g.mode === ue.TRIANGLE_FAN && (b.geometry = Js(b.geometry, xs));
        else if (g.mode === ue.LINES)
          b = new si(y, x);
        else if (g.mode === ue.LINE_STRIP)
          b = new ni(y, x);
        else if (g.mode === ue.LINE_LOOP)
          b = new ai(y, x);
        else if (g.mode === ue.POINTS)
          b = new aa(y, x);
        else
          throw new Error("THREE.GLTFLoader: Primitive mode unsupported: " + g.mode);
        Object.keys(b.geometry.morphAttributes).length > 0 && xr(b, i), b.name = t.createUniqueName(i.name || "mesh_" + e), we(b, i), g.extensions && ze(a, b, g), t.assignFinalMaterial(b), u.push(b);
      }
      for (let f = 0, p = u.length; f < p; f++)
        t.associations.set(u[f], {
          meshes: e,
          primitives: f
        });
      if (u.length === 1)
        return i.extensions && ze(a, u[0], i), u[0];
      const h = new Xe();
      i.extensions && ze(a, h, i), t.associations.set(h, { meshes: e });
      for (let f = 0, p = u.length; f < p; f++)
        h.add(u[f]);
      return h;
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#cameras
   *
   * @private
   * @param {number} cameraIndex
   * @return {Promise<THREE.Camera>}
   */
  loadCamera(e) {
    let t;
    const n = this.json.cameras[e], a = n[n.type];
    if (!a) {
      console.warn("THREE.GLTFLoader: Missing camera parameters.");
      return;
    }
    return n.type === "perspective" ? t = new ii(Ke.radToDeg(a.yfov), a.aspectRatio || 1, a.znear || 1, a.zfar || 2e6) : n.type === "orthographic" && (t = new ia(-a.xmag, a.xmag, a.ymag, -a.ymag, a.znear, a.zfar)), n.name && (t.name = this.createUniqueName(n.name)), we(t, n), Promise.resolve(t);
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#skins
   *
   * @private
   * @param {number} skinIndex
   * @return {Promise<Skeleton>}
   */
  loadSkin(e) {
    const t = this.json.skins[e], n = [];
    for (let a = 0, i = t.joints.length; a < i; a++)
      n.push(this._loadNodeShallow(t.joints[a]));
    return t.inverseBindMatrices !== void 0 ? n.push(this.getDependency("accessor", t.inverseBindMatrices)) : n.push(null), Promise.all(n).then(function(a) {
      const i = a.pop(), r = a, l = [], o = [];
      for (let c = 0, d = r.length; c < d; c++) {
        const u = r[c];
        if (u) {
          l.push(u);
          const h = new W();
          i !== null && h.fromArray(i.array, c * 16), o.push(h);
        } else
          console.warn('THREE.GLTFLoader: Joint "%s" could not be found.', t.joints[c]);
      }
      return new ri(l, o);
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#animations
   *
   * @private
   * @param {number} animationIndex
   * @return {Promise<AnimationClip>}
   */
  loadAnimation(e) {
    const t = this.json, n = this, a = t.animations[e], i = a.name ? a.name : "animation_" + e, r = [], l = [], o = [], c = [], d = [];
    for (let u = 0, h = a.channels.length; u < h; u++) {
      const f = a.channels[u], p = a.samplers[f.sampler], y = f.target, g = y.node, b = a.parameters !== void 0 ? a.parameters[p.input] : p.input, x = a.parameters !== void 0 ? a.parameters[p.output] : p.output;
      y.node !== void 0 && (r.push(this.getDependency("node", g)), l.push(this.getDependency("accessor", b)), o.push(this.getDependency("accessor", x)), c.push(p), d.push(y));
    }
    return Promise.all([
      Promise.all(r),
      Promise.all(l),
      Promise.all(o),
      Promise.all(c),
      Promise.all(d)
    ]).then(function(u) {
      const h = u[0], f = u[1], p = u[2], y = u[3], g = u[4], b = [];
      for (let x = 0, m = h.length; x < m; x++) {
        const v = h[x], w = f[x], T = p[x], M = y[x], S = g[x];
        if (v === void 0) continue;
        v.updateMatrix && v.updateMatrix();
        const R = n._createAnimationTracks(v, w, T, M, S);
        if (R)
          for (let E = 0; E < R.length; E++)
            b.push(R[E]);
      }
      return new oi(i, void 0, b);
    });
  }
  createNodeMesh(e) {
    const t = this.json, n = this, a = t.nodes[e];
    return a.mesh === void 0 ? null : n.getDependency("mesh", a.mesh).then(function(i) {
      const r = n._getNodeRef(n.meshCache, a.mesh, i);
      return a.weights !== void 0 && r.traverse(function(l) {
        if (l.isMesh)
          for (let o = 0, c = a.weights.length; o < c; o++)
            l.morphTargetInfluences[o] = a.weights[o];
      }), r;
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#nodes-and-hierarchy
   *
   * @private
   * @param {number} nodeIndex
   * @return {Promise<Object3D>}
   */
  loadNode(e) {
    const t = this.json, n = this, a = t.nodes[e], i = n._loadNodeShallow(e), r = [], l = a.children || [];
    for (let c = 0, d = l.length; c < d; c++)
      r.push(n.getDependency("node", l[c]));
    const o = a.skin === void 0 ? Promise.resolve(null) : n.getDependency("skin", a.skin);
    return Promise.all([
      i,
      Promise.all(r),
      o
    ]).then(function(c) {
      const d = c[0], u = c[1], h = c[2];
      h !== null && d.traverse(function(f) {
        f.isSkinnedMesh && f.bind(h, wr);
      });
      for (let f = 0, p = u.length; f < p; f++)
        d.add(u[f]);
      return d;
    });
  }
  // ._loadNodeShallow() parses a single node.
  // skin and child nodes are created and added in .loadNode() (no '_' prefix).
  _loadNodeShallow(e) {
    const t = this.json, n = this.extensions, a = this;
    if (this.nodeCache[e] !== void 0)
      return this.nodeCache[e];
    const i = t.nodes[e], r = i.name ? a.createUniqueName(i.name) : "", l = [], o = a._invokeOne(function(c) {
      return c.createNodeMesh && c.createNodeMesh(e);
    });
    return o && l.push(o), i.camera !== void 0 && l.push(a.getDependency("camera", i.camera).then(function(c) {
      return a._getNodeRef(a.cameraCache, i.camera, c);
    })), a._invokeAll(function(c) {
      return c.createNodeAttachment && c.createNodeAttachment(e);
    }).forEach(function(c) {
      l.push(c);
    }), this.nodeCache[e] = Promise.all(l).then(function(c) {
      let d;
      if (i.isBone === !0 ? d = new li() : c.length > 1 ? d = new Xe() : c.length === 1 ? d = c[0] : d = new Jn(), d !== c[0])
        for (let u = 0, h = c.length; u < h; u++)
          d.add(c[u]);
      if (i.name && (d.userData.name = i.name, d.name = r), we(d, i), i.extensions && ze(n, d, i), i.matrix !== void 0) {
        const u = new W();
        u.fromArray(i.matrix), d.applyMatrix4(u);
      } else
        i.translation !== void 0 && d.position.fromArray(i.translation), i.rotation !== void 0 && d.quaternion.fromArray(i.rotation), i.scale !== void 0 && d.scale.fromArray(i.scale);
      if (!a.associations.has(d))
        a.associations.set(d, {});
      else if (i.mesh !== void 0 && a.meshCache.refs[i.mesh] > 1) {
        const u = a.associations.get(d);
        a.associations.set(d, { ...u });
      }
      return a.associations.get(d).nodes = e, d;
    }), this.nodeCache[e];
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#scenes
   *
   * @private
   * @param {number} sceneIndex
   * @return {Promise<Group>}
   */
  loadScene(e) {
    const t = this.extensions, n = this.json.scenes[e], a = this, i = new Xe();
    n.name && (i.name = a.createUniqueName(n.name)), we(i, n), n.extensions && ze(t, i, n);
    const r = n.nodes || [], l = [];
    for (let o = 0, c = r.length; o < c; o++)
      l.push(a.getDependency("node", r[o]));
    return Promise.all(l).then(function(o) {
      for (let d = 0, u = o.length; d < u; d++)
        i.add(o[d]);
      const c = (d) => {
        const u = /* @__PURE__ */ new Map();
        for (const [h, f] of a.associations)
          (h instanceof Jt || h instanceof js) && u.set(h, f);
        return d.traverse((h) => {
          const f = a.associations.get(h);
          f != null && u.set(h, f);
        }), u;
      };
      return a.associations = c(i), i;
    });
  }
  _createAnimationTracks(e, t, n, a, i) {
    const r = [], l = e.name ? e.name : e.uuid, o = [];
    Ee[i.path] === Ee.weights ? e.traverse(function(h) {
      h.morphTargetInfluences && o.push(h.name ? h.name : h.uuid);
    }) : o.push(l);
    let c;
    switch (Ee[i.path]) {
      case Ee.weights:
        c = Hs;
        break;
      case Ee.rotation:
        c = Gs;
        break;
      case Ee.translation:
      case Ee.scale:
        c = Us;
        break;
      default:
        n.itemSize === 1 ? c = Hs : c = Us;
        break;
    }
    const d = a.interpolation !== void 0 ? mr[a.interpolation] : ra, u = this._getArrayFromAccessor(n);
    for (let h = 0, f = o.length; h < f; h++) {
      const p = new c(
        o[h] + "." + Ee[i.path],
        t.array,
        u,
        d
      );
      a.interpolation === "CUBICSPLINE" && this._createCubicSplineTrackInterpolant(p), r.push(p);
    }
    return r;
  }
  _getArrayFromAccessor(e) {
    let t = e.array;
    if (e.normalized) {
      const n = Ts(t.constructor), a = new Float32Array(t.length);
      for (let i = 0, r = t.length; i < r; i++)
        a[i] = t[i] * n;
      t = a;
    }
    return t;
  }
  _createCubicSplineTrackInterpolant(e) {
    e.createInterpolant = function(n) {
      const a = this instanceof Gs ? pr : xa;
      return new a(this.times, this.values, this.getValueSize() / 3, n);
    }, e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = !0;
  }
}
function Ar(s, e, t) {
  const n = e.attributes, a = new Is();
  if (n.POSITION !== void 0) {
    const l = t.json.accessors[n.POSITION], o = l.min, c = l.max;
    if (o !== void 0 && c !== void 0) {
      if (a.set(
        new B(o[0], o[1], o[2]),
        new B(c[0], c[1], c[2])
      ), l.normalized) {
        const d = Ts(qe[l.componentType]);
        a.min.multiplyScalar(d), a.max.multiplyScalar(d);
      }
    } else {
      console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
      return;
    }
  } else
    return;
  const i = e.targets;
  if (i !== void 0) {
    const l = new B(), o = new B();
    for (let c = 0, d = i.length; c < d; c++) {
      const u = i[c];
      if (u.POSITION !== void 0) {
        const h = t.json.accessors[u.POSITION], f = h.min, p = h.max;
        if (f !== void 0 && p !== void 0) {
          if (o.setX(Math.max(Math.abs(f[0]), Math.abs(p[0]))), o.setY(Math.max(Math.abs(f[1]), Math.abs(p[1]))), o.setZ(Math.max(Math.abs(f[2]), Math.abs(p[2]))), h.normalized) {
            const y = Ts(qe[h.componentType]);
            o.multiplyScalar(y);
          }
          l.max(o);
        } else
          console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
      }
    }
    a.expandByVector(l);
  }
  s.boundingBox = a;
  const r = new Ds();
  a.getCenter(r.center), r.radius = a.min.distanceTo(a.max) / 2, s.boundingSphere = r;
}
function sn(s, e, t) {
  const n = e.attributes, a = [];
  function i(r, l) {
    return t.getDependency("accessor", r).then(function(o) {
      s.setAttribute(l, o);
    });
  }
  for (const r in n) {
    const l = ws[r] || r.toLowerCase();
    l in s.attributes || a.push(i(n[r], l));
  }
  if (e.indices !== void 0 && !s.index) {
    const r = t.getDependency("accessor", e.indices).then(function(l) {
      s.setIndex(l);
    });
    a.push(r);
  }
  return Vs.workingColorSpace !== Se && "COLOR_0" in n && console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${Vs.workingColorSpace}" not supported.`), we(s, e), Ar(s, e, t), Promise.all(a).then(function() {
    return e.targets !== void 0 ? gr(s, e.targets, t) : s;
  });
}
var ya = class extends Bi {
  constructor(s = Gt) {
    super(), this.manager = s, this.adjustmentTransform = new W();
  }
  parse(s) {
    let e = super.parse(s), t = e.glbBytes.slice().buffer;
    return new Promise((n, a) => {
      let i = this.manager, r = this.fetchOptions, l = i.getHandler("path.gltf") || new Kt(i);
      r.credentials === "include" && r.mode === "cors" && l.setCrossOrigin("use-credentials"), "credentials" in r && l.setWithCredentials(r.credentials === "include"), r.headers && l.setRequestHeader(r.headers);
      let o = this.workingPath;
      !/[\\/]$/.test(o) && o.length && (o += "/");
      let c = this.adjustmentTransform;
      l.parse(t, o, (d) => {
        let { batchTable: u, featureTable: h } = e, { scene: f } = d, p = h.getData("RTC_CENTER", 1, "FLOAT", "VEC3");
        p && (f.position.x += p[0], f.position.y += p[1], f.position.z += p[2]), d.scene.updateMatrix(), d.scene.matrix.multiply(c), d.scene.matrix.decompose(d.scene.position, d.scene.quaternion, d.scene.scale), d.batchTable = u, d.featureTable = h, f.batchTable = u, f.featureTable = h, n(d);
      }, a);
    });
  }
};
function Mr(s) {
  let e = s >> 11, t = s >> 5 & 63, n = s & 31;
  return [
    Math.round(e / 31 * 255),
    Math.round(t / 63 * 255),
    Math.round(n / 31 * 255)
  ];
}
var Qe = /* @__PURE__ */ new se();
function Sr(s, e, t = new B()) {
  Qe.set(s, e).divideScalar(256).multiplyScalar(2).subScalar(1), t.set(Qe.x, Qe.y, 1 - Math.abs(Qe.x) - Math.abs(Qe.y));
  let n = Ke.clamp(-t.z, 0, 1);
  return t.x >= 0 ? t.setX(t.x - n) : t.setX(t.x + n), t.y >= 0 ? t.setY(t.y - n) : t.setY(t.y + n), t.normalize(), t;
}
var nn = {
  RGB: "color",
  POSITION: "position"
}, va = class extends Ui {
  constructor(s = Gt) {
    super(), this.manager = s;
  }
  parse(s) {
    return super.parse(s).then(async (e) => {
      let { featureTable: t, batchTable: n } = e, a = new ta(), i = t.header.extensions, r = new B(), l;
      if (i && i["3DTILES_draco_point_compression"]) {
        let { byteOffset: d, byteLength: u, properties: h } = i["3DTILES_draco_point_compression"], f = this.manager.getHandler("draco.drc");
        if (f == null) throw Error("PNTSLoader: dracoLoader not available.");
        let p = {};
        for (let b in h) if (b in nn && b in h) {
          let x = nn[b];
          p[x] = h[b];
        }
        let y = {
          attributeIDs: p,
          attributeTypes: {
            position: "Float32Array",
            color: "Uint8Array"
          },
          useUniqueIDs: !0
        }, g = t.getBuffer(d, u);
        l = await f.decodeGeometry(g, y), l.attributes.color && (a.vertexColors = !0);
      } else {
        let d = t.getData("POINTS_LENGTH"), u = t.getData("POSITION", d, "FLOAT", "VEC3"), h = t.getData("NORMAL", d, "FLOAT", "VEC3"), f = t.getData("NORMAL", d, "UNSIGNED_BYTE", "VEC2"), p = t.getData("RGB", d, "UNSIGNED_BYTE", "VEC3"), y = t.getData("RGBA", d, "UNSIGNED_BYTE", "VEC4"), g = t.getData("RGB565", d, "UNSIGNED_SHORT", "SCALAR"), b = t.getData("CONSTANT_RGBA", d, "UNSIGNED_BYTE", "VEC4"), x = t.getData("POSITION_QUANTIZED", d, "UNSIGNED_SHORT", "VEC3"), m = t.getData("QUANTIZED_VOLUME_SCALE", d, "FLOAT", "VEC3"), v = t.getData("QUANTIZED_VOLUME_OFFSET", d, "FLOAT", "VEC3");
        if (l = new Os(), x) {
          let w = new Float32Array(d * 3);
          for (let T = 0; T < d; T++) for (let M = 0; M < 3; M++) {
            let S = 3 * T + M;
            w[S] = x[S] / 65535 * m[M];
          }
          r.x = v[0], r.y = v[1], r.z = v[2], l.setAttribute("position", new le(w, 3, !1));
        } else l.setAttribute("position", new le(u, 3, !1));
        if (h !== null) l.setAttribute("normal", new le(h, 3, !1));
        else if (f !== null) {
          let w = new Float32Array(d * 3), T = new B();
          for (let M = 0; M < d; M++) {
            let S = f[M * 2], R = f[M * 2 + 1], E = Sr(S, R, T);
            w[M * 3] = E.x, w[M * 3 + 1] = E.y, w[M * 3 + 2] = E.z;
          }
          l.setAttribute("normal", new le(w, 3, !1));
        }
        if (y !== null) l.setAttribute("color", new le(y, 4, !0)), a.vertexColors = !0, a.transparent = !0, a.depthWrite = !1;
        else if (p !== null) l.setAttribute("color", new le(p, 3, !0)), a.vertexColors = !0;
        else if (g !== null) {
          let w = new Uint8Array(d * 3);
          for (let T = 0; T < d; T++) {
            let M = Mr(g[T]);
            for (let S = 0; S < 3; S++) {
              let R = 3 * T + S;
              w[R] = M[S];
            }
          }
          l.setAttribute("color", new le(w, 3, !0)), a.vertexColors = !0;
        } else if (b !== null) {
          a.color = new Oe(b[0], b[1], b[2]);
          let w = b[3] / 255;
          w < 1 && (a.opacity = w, a.transparent = !0, a.depthWrite = !1);
        }
      }
      let o = new aa(l, a);
      o.position.copy(r), e.scene = o, e.scene.featureTable = t, e.scene.batchTable = n;
      let c = t.getData("RTC_CENTER", 1, "FLOAT", "VEC3");
      return c && (e.scene.position.x += c[0], e.scene.position.y += c[1], e.scene.position.z += c[2]), e;
    });
  }
};
function Rr(s) {
  let { x: e, y: t, z: n } = s;
  s.x = n, s.y = e, s.z = t;
}
function Er(s) {
  return -s + Math.PI / 2;
}
var an = /* @__PURE__ */ new pi(), Ce = /* @__PURE__ */ new B(), ne = /* @__PURE__ */ new B(), ss = /* @__PURE__ */ new B(), ce = /* @__PURE__ */ new W(), fe = /* @__PURE__ */ new W(), ns = /* @__PURE__ */ new Ds(), ie = /* @__PURE__ */ new fi(), rn = /* @__PURE__ */ new B(), on = /* @__PURE__ */ new B(), ln = /* @__PURE__ */ new B(), Je = /* @__PURE__ */ new B(), Tt = /* @__PURE__ */ new Ps(), Cr = 1e-12, Fr = 0.1, wa = class {
  constructor(s = 1, e = 1, t = 1) {
    this.name = "", this.radius = new B(s, e, t);
  }
  intersectRay(s, e) {
    return ce.makeScale(...this.radius).invert(), ns.center.set(0, 0, 0), ns.radius = 1, Tt.copy(s).applyMatrix4(ce), Tt.intersectSphere(ns, e) ? (ce.makeScale(...this.radius), e.applyMatrix4(ce), e) : null;
  }
  getEastNorthUpFrame(s, e, t, n) {
    return t.isMatrix4 && (n = t, t = 0, console.warn('Ellipsoid: The signature for "getEastNorthUpFrame" has changed.')), this.getEastNorthUpAxes(s, e, rn, on, ln), this.getCartographicToPosition(s, e, t, Je), n.makeBasis(rn, on, ln).setPosition(Je);
  }
  getOrientedEastNorthUpFrame(s, e, t, n, a, i, r) {
    return this.getObjectFrame(s, e, t, n, a, i, r, 0);
  }
  getObjectFrame(s, e, t, n, a, i, r, l = 2) {
    return this.getEastNorthUpFrame(s, e, t, ce), ie.set(a, i, -n, "ZXY"), r.makeRotationFromEuler(ie).premultiply(ce), l === 1 ? (ie.set(Math.PI / 2, 0, 0, "XYZ"), fe.makeRotationFromEuler(ie), r.multiply(fe)) : l === 2 && (ie.set(-Math.PI / 2, 0, Math.PI, "XYZ"), fe.makeRotationFromEuler(ie), r.multiply(fe)), r;
  }
  getCartographicFromObjectFrame(s, e, t = 2) {
    return t === 1 ? (ie.set(-Math.PI / 2, 0, 0, "XYZ"), fe.makeRotationFromEuler(ie).premultiply(s)) : t === 2 ? (ie.set(-Math.PI / 2, 0, Math.PI, "XYZ"), fe.makeRotationFromEuler(ie).premultiply(s)) : fe.copy(s), Je.setFromMatrixPosition(fe), this.getPositionToCartographic(Je, e), this.getEastNorthUpFrame(e.lat, e.lon, 0, ce).invert(), fe.premultiply(ce), ie.setFromRotationMatrix(fe, "ZXY"), e.azimuth = -ie.z, e.elevation = ie.x, e.roll = ie.y, e;
  }
  getEastNorthUpAxes(s, e, t, n, a, i = Je) {
    this.getCartographicToPosition(s, e, 0, i), this.getCartographicToNormal(s, e, a), t.set(-i.y, i.x, 0).normalize(), n.crossVectors(a, t).normalize();
  }
  getCartographicToPosition(s, e, t, n) {
    this.getCartographicToNormal(s, e, Ce);
    let a = this.radius;
    ne.copy(Ce), ne.x *= a.x ** 2, ne.y *= a.y ** 2, ne.z *= a.z ** 2;
    let i = Math.sqrt(Ce.dot(ne));
    return ne.divideScalar(i), n.copy(ne).addScaledVector(Ce, t);
  }
  getPositionToCartographic(s, e) {
    this.getPositionToSurfacePoint(s, ne), this.getPositionToNormal(ne, Ce);
    let t = ss.subVectors(s, ne);
    return e.lon = Math.atan2(Ce.y, Ce.x), e.lat = Math.asin(Ce.z), e.height = Math.sign(t.dot(s)) * t.length(), e;
  }
  getCartographicToNormal(s, e, t) {
    return an.set(1, Er(s), e), t.setFromSpherical(an).normalize(), Rr(t), t;
  }
  getPositionToNormal(s, e) {
    let t = this.radius;
    return e.copy(s), e.x /= t.x ** 2, e.y /= t.y ** 2, e.z /= t.z ** 2, e.normalize(), e;
  }
  getPositionToSurfacePoint(s, e) {
    let t = this.radius, n = 1 / t.x ** 2, a = 1 / t.y ** 2, i = 1 / t.z ** 2, r = s.x * s.x * n, l = s.y * s.y * a, o = s.z * s.z * i, c = r + l + o, d = Math.sqrt(1 / c), u = ne.copy(s).multiplyScalar(d);
    if (c < Fr) return isFinite(d) ? e.copy(u) : null;
    let h = ss.set(u.x * n * 2, u.y * a * 2, u.z * i * 2), f = (1 - d) * s.length() / (0.5 * h.length()), p = 0, y, g, b, x, m, v, w, T, M, S, R;
    do {
      f -= p, b = 1 / (1 + f * n), x = 1 / (1 + f * a), m = 1 / (1 + f * i), v = b * b, w = x * x, T = m * m, M = v * b, S = w * x, R = T * m, y = r * v + l * w + o * T - 1, g = r * M * n + l * S * a + o * R * i;
      let E = -2 * g;
      p = y / E;
    } while (Math.abs(y) > Cr);
    return e.set(s.x * b, s.y * x, s.z * m);
  }
  calculateHorizonDistance(s, e) {
    let t = this.calculateEffectiveRadius(s);
    return Math.sqrt(2 * t * e + e ** 2);
  }
  calculateEffectiveRadius(s) {
    let e = this.radius.x, t = 1 - this.radius.z ** 2 / e ** 2, n = s * Ke.DEG2RAD, a = Math.sin(n) ** 2;
    return e / Math.sqrt(1 - t * a);
  }
  getPositionElevation(s) {
    this.getPositionToSurfacePoint(s, ne);
    let e = ss.subVectors(s, ne);
    return Math.sign(e.dot(s)) * e.length();
  }
  closestPointToRayEstimate(s, e) {
    return this.intersectRay(s, e) ? e : (ce.makeScale(...this.radius).invert(), Tt.copy(s).applyMatrix4(ce), ne.set(0, 0, 0), Tt.closestPointToPoint(ne, e).normalize(), ce.makeScale(...this.radius), e.applyMatrix4(ce));
  }
  copy(s) {
    return this.radius.copy(s.radius), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
}, Yt = new wa(Ks, Ks, Ci);
Yt.name = "WGS84 Earth";
var At = /* @__PURE__ */ new B(), je = /* @__PURE__ */ new B(), Ue = /* @__PURE__ */ new B(), as = /* @__PURE__ */ new B(), Mt = /* @__PURE__ */ new Ht(), St = /* @__PURE__ */ new B(), He = /* @__PURE__ */ new W(), cn = /* @__PURE__ */ new W(), un = /* @__PURE__ */ new B(), dn = /* @__PURE__ */ new W(), is = /* @__PURE__ */ new Ht(), rs = {};
function hn(s, e, t, n) {
  if (s = s / t * 2 - 1, e = e / t * 2 - 1, n.x = s, n.y = e, n.z = 1 - Math.abs(s) - Math.abs(e), n.z < 0) {
    let a = n.x;
    n.x = (1 - Math.abs(n.y)) * (a >= 0 ? 1 : -1), n.y = (1 - Math.abs(a)) * (n.y >= 0 ? 1 : -1);
  }
  return n.normalize(), n;
}
var Ta = class extends ji {
  constructor(s = Gt) {
    super(), this.manager = s, this.adjustmentTransform = new W(), this.ellipsoid = Yt.clone();
  }
  resolveExternalURL(s) {
    return this.manager.resolveURL(super.resolveExternalURL(s));
  }
  parse(s) {
    return super.parse(s).then((e) => {
      let { featureTable: t, batchTable: n } = e, a = e.glbBytes.slice().buffer;
      return new Promise((i, r) => {
        let l = this.fetchOptions, o = this.manager, c = o.getHandler("path.gltf") || new Kt(o);
        l.credentials === "include" && l.mode === "cors" && c.setCrossOrigin("use-credentials"), "credentials" in l && c.setWithCredentials(l.credentials === "include"), l.headers && c.setRequestHeader(l.headers);
        let d = e.gltfWorkingPath ?? this.workingPath;
        /[\\/]$/.test(d) || (d += "/");
        let u = this.adjustmentTransform;
        c.parse(a, d, (h) => {
          let f = t.getData("INSTANCES_LENGTH"), p = t.getData("POSITION", f, "FLOAT", "VEC3"), y = t.getData("POSITION_QUANTIZED", f, "UNSIGNED_SHORT", "VEC3"), g = t.getData("QUANTIZED_VOLUME_OFFSET", 1, "FLOAT", "VEC3"), b = t.getData("QUANTIZED_VOLUME_SCALE", 1, "FLOAT", "VEC3"), x = t.getData("NORMAL_UP", f, "FLOAT", "VEC3"), m = t.getData("NORMAL_RIGHT", f, "FLOAT", "VEC3"), v = t.getData("NORMAL_UP_OCT32P", f, "UNSIGNED_SHORT", "VEC2"), w = t.getData("NORMAL_RIGHT_OCT32P", f, "UNSIGNED_SHORT", "VEC2"), T = t.getData("SCALE_NON_UNIFORM", f, "FLOAT", "VEC3"), M = t.getData("SCALE", f, "FLOAT", "SCALAR"), S = t.getData("RTC_CENTER", 1, "FLOAT", "VEC3"), R = t.getData("EAST_NORTH_UP");
          if (!p && y) {
            p = new Float32Array(f * 3);
            for (let A = 0; A < f; A++) p[A * 3 + 0] = g[0] + y[A * 3 + 0] / 65535 * b[0], p[A * 3 + 1] = g[1] + y[A * 3 + 1] / 65535 * b[1], p[A * 3 + 2] = g[2] + y[A * 3 + 2] / 65535 * b[2];
          }
          let E = new B();
          for (let A = 0; A < f; A++) E.x += p[A * 3 + 0] / f, E.y += p[A * 3 + 1] / f, E.z += p[A * 3 + 2] / f;
          let O = [], I = [];
          h.scene.updateMatrixWorld(), h.scene.traverse((A) => {
            if (A.isMesh) {
              I.push(A);
              let { geometry: F, material: k } = A, C = new Qn(F, k, f);
              C.position.copy(E), S && (C.position.x += S[0], C.position.y += S[1], C.position.z += S[2]), O.push(C);
            }
          });
          for (let A = 0; A < f; A++) {
            as.set(p[A * 3 + 0] - E.x, p[A * 3 + 1] - E.y, p[A * 3 + 2] - E.z), Mt.identity(), x && m ? (je.set(x[A * 3 + 0], x[A * 3 + 1], x[A * 3 + 2]), Ue.set(m[A * 3 + 0], m[A * 3 + 1], m[A * 3 + 2]), At.crossVectors(Ue, je).normalize(), He.makeBasis(Ue, je, At), Mt.setFromRotationMatrix(He)) : v && w && (hn(v[A * 2 + 0], v[A * 2 + 1], 65535, je), hn(w[A * 2 + 0], w[A * 2 + 1], 65535, Ue), At.crossVectors(Ue, je).normalize(), He.makeBasis(Ue, je, At), Mt.setFromRotationMatrix(He)), St.set(1, 1, 1), T && St.set(T[A * 3 + 0], T[A * 3 + 1], T[A * 3 + 2]), M && St.multiplyScalar(M[A]);
            for (let F = 0, k = O.length; F < k; F++) {
              let C = O[F];
              is.copy(Mt), R && (C.updateMatrixWorld(), un.copy(as).applyMatrix4(C.matrixWorld), this.ellipsoid.getPositionToCartographic(un, rs), this.ellipsoid.getEastNorthUpFrame(rs.lat, rs.lon, dn), is.setFromRotationMatrix(dn)), He.compose(as, is, St).multiply(u);
              let D = I[F];
              cn.multiplyMatrices(He, D.matrixWorld), C.setMatrixAt(A, cn);
            }
          }
          h.scene.clear(), h.scene.add(...O), h.batchTable = n, h.featureTable = t, h.scene.batchTable = n, h.scene.featureTable = t, i(h);
        }, r);
      });
    });
  }
}, kr = class extends Hi {
  constructor(s = Gt) {
    super(), this.manager = s, this.adjustmentTransform = new W(), this.ellipsoid = Yt.clone();
  }
  parse(s) {
    let e = super.parse(s), { manager: t, ellipsoid: n, adjustmentTransform: a } = this, i = [];
    for (let r in e.tiles) {
      let { type: l, buffer: o } = e.tiles[r];
      switch (l) {
        case "b3dm": {
          let c = o.slice(), d = new ya(t);
          d.workingPath = this.workingPath, d.fetchOptions = this.fetchOptions, d.adjustmentTransform.copy(a);
          let u = d.parse(c.buffer);
          i.push(u);
          break;
        }
        case "pnts": {
          let c = o.slice(), d = new va(t);
          d.workingPath = this.workingPath, d.fetchOptions = this.fetchOptions;
          let u = d.parse(c.buffer);
          i.push(u);
          break;
        }
        case "i3dm": {
          let c = o.slice(), d = new Ta(t);
          d.workingPath = this.workingPath, d.fetchOptions = this.fetchOptions, d.ellipsoid.copy(n), d.adjustmentTransform.copy(a);
          let u = d.parse(c.buffer);
          i.push(u);
          break;
        }
      }
    }
    return Promise.all(i).then((r) => {
      let l = new Xe();
      return r.forEach((o) => {
        l.add(o.scene);
      }), {
        tiles: r,
        scene: l
      };
    });
  }
}, $e = /* @__PURE__ */ new W(), Or = class extends Xe {
  constructor(s) {
    super(), this.isTilesGroup = !0, this.name = "TilesRenderer.TilesGroup", this.tilesRenderer = s, this.matrixWorldInverse = new W();
  }
  raycast(s, e) {
    return this.tilesRenderer.raycast(s, e), !1;
  }
  updateMatrixWorld(s) {
    if (this.matrixAutoUpdate && this.updateMatrix(), this.matrixWorldNeedsUpdate || s) {
      this.parent === null ? $e.copy(this.matrix) : $e.multiplyMatrices(this.parent.matrixWorld, this.matrix), this.matrixWorldNeedsUpdate = !1;
      let e = $e.elements, t = this.matrixWorld.elements, n = !1;
      for (let a = 0; a < 16; a++) {
        let i = e[a], r = t[a];
        if (Math.abs(i - r) > 2 ** -52) {
          n = !0;
          break;
        }
      }
      if (n) {
        this.matrixWorld.copy($e), this.matrixWorldInverse.copy($e).invert();
        let a = this.children;
        for (let o = 0, c = a.length; o < c; o++) a[o].updateMatrixWorld();
        let { tilesRenderer: i } = this, { activeTiles: r, visibleTiles: l } = i;
        r.forEach((o) => {
          l.has(o) || o.engineData.scene.updateMatrixWorld(!0);
        });
      }
    }
  }
  updateWorldMatrix(s, e) {
    this.parent && s && this.parent.updateWorldMatrix(s, !1), this.updateMatrixWorld(!0);
  }
}, Ir = /* @__PURE__ */ new Ps();
function Dr(s, e, t, n) {
  let { scene: a } = s.engineData;
  t.invokeOnePlugin((i) => i.raycastTile && i.raycastTile(s, a, e, n)) || e.intersectObject(a, !0, n);
}
function Pr(s) {
  return "traversal" in s;
}
function Aa(s, e, t, n, a = null) {
  if (!Pr(e)) return;
  let { group: i, activeTiles: r } = s, { boundingVolume: l } = e.engineData;
  if (a === null && (a = Ir, a.copy(t.ray).applyMatrix4(i.matrixWorldInverse)), !e.traversal.used || !l.intersectsRay(a)) return;
  r.has(e) && Dr(e, t, s, n);
  let o = e.children;
  for (let c = 0, d = o.length; c < d; c++) Aa(s, o[c], t, n, a);
}
var Rt = /* @__PURE__ */ new B(), Et = /* @__PURE__ */ new B(), re = /* @__PURE__ */ new B(), Ct = /* @__PURE__ */ new Ps(), fn = class {
  constructor(s = new Is(), e = new W()) {
    this.box = s.clone(), this.transform = e.clone(), this.inverseTransform = new W(), this.points = Array(8).fill().map(() => new B()), this.planes = [
      ,
      ,
      ,
      ,
      ,
      ,
    ].fill().map(() => new bi());
  }
  copy(s) {
    return this.box.copy(s.box), this.transform.copy(s.transform), this.update(), this;
  }
  clone() {
    return new this.constructor().copy(this);
  }
  clampPoint(s, e) {
    return e.copy(s).applyMatrix4(this.inverseTransform).clamp(this.box.min, this.box.max).applyMatrix4(this.transform);
  }
  distanceToPoint(s) {
    return this.clampPoint(s, re).distanceTo(s);
  }
  containsPoint(s) {
    return re.copy(s).applyMatrix4(this.inverseTransform), this.box.containsPoint(re);
  }
  intersectsRay(s) {
    return Ct.copy(s).applyMatrix4(this.inverseTransform), Ct.intersectsBox(this.box);
  }
  intersectRay(s, e) {
    return Ct.copy(s).applyMatrix4(this.inverseTransform), Ct.intersectBox(this.box, e) ? (e.applyMatrix4(this.transform), e) : null;
  }
  update() {
    let { points: s, inverseTransform: e, transform: t, box: n } = this;
    e.copy(t).invert();
    let { min: a, max: i } = n, r = 0;
    for (let l = -1; l <= 1; l += 2) for (let o = -1; o <= 1; o += 2) for (let c = -1; c <= 1; c += 2) s[r].set(l < 0 ? a.x : i.x, o < 0 ? a.y : i.y, c < 0 ? a.z : i.z).applyMatrix4(t), r++;
    this.updatePlanes();
  }
  updatePlanes() {
    Rt.copy(this.box.min).applyMatrix4(this.transform), Et.copy(this.box.max).applyMatrix4(this.transform), re.set(0, 0, 1).transformDirection(this.transform), this.planes[0].setFromNormalAndCoplanarPoint(re, Rt), this.planes[1].setFromNormalAndCoplanarPoint(re, Et).negate(), re.set(0, 1, 0).transformDirection(this.transform), this.planes[2].setFromNormalAndCoplanarPoint(re, Rt), this.planes[3].setFromNormalAndCoplanarPoint(re, Et).negate(), re.set(1, 0, 0).transformDirection(this.transform), this.planes[4].setFromNormalAndCoplanarPoint(re, Rt), this.planes[5].setFromNormalAndCoplanarPoint(re, Et).negate();
  }
  intersectsSphere(s) {
    return this.clampPoint(s.center, re), re.distanceToSquared(s.center) <= s.radius * s.radius;
  }
  intersectsFrustum(s) {
    return this._intersectsPlaneShape(s.planes, s.points);
  }
  intersectsOBB(s) {
    return this._intersectsPlaneShape(s.planes, s.points);
  }
  _intersectsPlaneShape(s, e) {
    let t = this.points, n = this.planes;
    for (let a = 0; a < 6; a++) {
      let i = s[a], r = -1 / 0;
      for (let l = 0; l < 8; l++) {
        let o = t[l], c = i.distanceToPoint(o);
        r = r < c ? c : r;
      }
      if (r < 0) return !1;
    }
    for (let a = 0; a < 6; a++) {
      let i = n[a], r = -1 / 0;
      for (let l = 0; l < 8; l++) {
        let o = e[l], c = i.distanceToPoint(o);
        r = r < c ? c : r;
      }
      if (r < 0) return !1;
    }
    return !0;
  }
}, ot = Math.PI, os = ot / 2, et = /* @__PURE__ */ new B(), _e = /* @__PURE__ */ new B(), he = /* @__PURE__ */ new B(), _ = /* @__PURE__ */ new B(), ae = /* @__PURE__ */ new W(), zr = /* @__PURE__ */ new Is(), pn = /* @__PURE__ */ new W();
function Fe(s, e) {
  e.radius = Math.max(e.radius, s.distanceToSquared(e.center));
}
function mn(s) {
  return s.x !== s.y;
}
var _r = class extends wa {
  constructor(s = 1, e = 1, t = 1, n = -os, a = os, i = 0, r = 2 * ot, l = 0, o = 0) {
    super(s, e, t), this.latStart = n, this.latEnd = a, this.lonStart = i, this.lonEnd = r, this.heightStart = l, this.heightEnd = o;
  }
  getBoundingBox(s, e) {
    mn(this.radius) && console.warn("EllipsoidRegion: Triaxial ellipsoids are not supported.");
    let { latStart: t, latEnd: n, lonStart: a, lonEnd: i, heightStart: r, heightEnd: l } = this, o = (t + n) * 0.5, c = (a + i) * 0.5, d = t > 0, u = n < 0, h;
    h = d ? t : u ? n : 0;
    let { min: f, max: p } = s;
    f.setScalar(1 / 0), p.setScalar(-1 / 0), i - a <= ot ? (this.getCartographicToNormal(o, c, he), _e.set(0, 0, 1), et.crossVectors(_e, he).normalize(), _e.crossVectors(he, et).normalize(), e.makeBasis(et, _e, he), ae.copy(e).invert(), this.getCartographicToPosition(h, a, l, _).applyMatrix4(ae), p.x = Math.abs(_.x), f.x = -p.x, this.getCartographicToPosition(n, a, l, _).applyMatrix4(ae), p.y = _.y, this.getCartographicToPosition(n, c, l, _).applyMatrix4(ae), p.y = Math.max(_.y, p.y), this.getCartographicToPosition(t, a, l, _).applyMatrix4(ae), f.y = _.y, this.getCartographicToPosition(t, c, l, _).applyMatrix4(ae), f.y = Math.min(_.y, f.y), this.getCartographicToPosition(o, c, l, _).applyMatrix4(ae), p.z = _.z, this.getCartographicToPosition(t, a, r, _).applyMatrix4(ae), f.z = _.z, this.getCartographicToPosition(n, a, r, _).applyMatrix4(ae), f.z = Math.min(_.z, f.z)) : (this.getCartographicToPosition(h, c, l, he), he.z = 0, he.length() < 1e-10 ? he.set(1, 0, 0) : he.normalize(), _e.set(0, 0, 1), et.crossVectors(he, _e).normalize(), e.makeBasis(et, _e, he), ae.copy(e).invert(), this.getCartographicToPosition(h, c + os, l, _).applyMatrix4(ae), p.x = Math.abs(_.x), f.x = -p.x, this.getCartographicToPosition(n, 0, u ? r : l, _).applyMatrix4(ae), p.y = _.y, this.getCartographicToPosition(t, 0, d ? r : l, _).applyMatrix4(ae), f.y = _.y, this.getCartographicToPosition(h, c, l, _).applyMatrix4(ae), p.z = _.z, this.getCartographicToPosition(h, i, l, _).applyMatrix4(ae), f.z = _.z), s.getCenter(_), s.min.sub(_).multiplyScalar(1.0000000000001), s.max.sub(_).multiplyScalar(1.0000000000001), _.applyMatrix4(e), e.setPosition(_);
  }
  getBoundingSphere(s) {
    mn(this.radius) && console.warn("EllipsoidRegion: Triaxial ellipsoids are not supported."), this.getBoundingBox(zr, pn), s.center.setFromMatrixPosition(pn), s.radius = 0;
    let { latStart: e, latEnd: t, lonStart: n, lonEnd: a, heightStart: i, heightEnd: r } = this, l = (e + t) * 0.5, o = (n + a) * 0.5, c = e > 0, d = t < 0, u;
    u = c ? e : d ? t : 0, this.getCartographicToPosition(u, n, r, _), Fe(_, s), this.getCartographicToPosition(t, n, r, _), Fe(_, s), this.getCartographicToPosition(t, o, r, _), Fe(_, s), this.getCartographicToPosition(e, n, r, _), Fe(_, s), this.getCartographicToPosition(e, o, r, _), Fe(_, s), this.getCartographicToPosition(l, o, r, _), Fe(_, s), this.getCartographicToPosition(e, n, i, _), Fe(_, s), a - n > ot && (this.getCartographicToPosition(u, o + ot, r, _), Fe(_, s)), s.radius = Math.sqrt(s.radius) * 1.0000000000001;
  }
}, be = /* @__PURE__ */ new B(), ge = /* @__PURE__ */ new B(), xe = /* @__PURE__ */ new B(), bn = /* @__PURE__ */ new B(), gn = /* @__PURE__ */ new B(), Lr = class {
  constructor() {
    this.sphere = null, this.obb = null, this.region = null, this.regionObb = null;
  }
  intersectsRay(s) {
    let e = this.sphere, t = this.obb || this.regionObb;
    return !(e && !s.intersectsSphere(e) || t && !t.intersectsRay(s));
  }
  intersectRay(s, e = null) {
    let t = this.sphere, n = this.obb || this.regionObb, a = -1 / 0, i = -1 / 0;
    t && s.intersectSphere(t, bn) && (a = t.containsPoint(s.origin) ? 0 : s.origin.distanceToSquared(bn)), n && n.intersectRay(s, gn) && (i = n.containsPoint(s.origin) ? 0 : s.origin.distanceToSquared(gn));
    let r = Math.max(a, i);
    return r === -1 / 0 ? null : (s.at(Math.sqrt(r), e), e);
  }
  distanceToPoint(s) {
    let e = this.sphere, t = this.obb || this.regionObb, n = -1 / 0, a = -1 / 0;
    return e && (n = Math.max(e.distanceToPoint(s), 0)), t && (a = t.distanceToPoint(s)), n > a ? n : a;
  }
  intersectsFrustum(s) {
    let e = this.obb || this.regionObb, t = this.sphere;
    return t && !s.intersectsSphere(t) || e && !e.intersectsFrustum(s) ? !1 : !!(t || e);
  }
  intersectsSphere(s) {
    let e = this.obb || this.regionObb, t = this.sphere;
    return t && !t.intersectsSphere(s) || e && !e.intersectsSphere(s) ? !1 : !!(t || e);
  }
  intersectsOBB(s) {
    let e = this.obb || this.regionObb, t = this.sphere;
    return t && !s.intersectsSphere(t) || e && !e.intersectsOBB(s) ? !1 : !!(t || e);
  }
  getOBB(s, e) {
    let t = this.obb || this.regionObb;
    t ? (s.copy(t.box), e.copy(t.transform)) : (this.getAABB(s), e.identity());
  }
  getAABB(s) {
    if (this.sphere) this.sphere.getBoundingBox(s);
    else {
      let e = this.obb || this.regionObb;
      s.copy(e.box).applyMatrix4(e.transform);
    }
  }
  getSphere(s) {
    if (this.sphere) s.copy(this.sphere);
    else if (this.region) this.region.getBoundingSphere(s);
    else {
      let e = this.obb || this.regionObb;
      e.box.getBoundingSphere(s), s.applyMatrix4(e.transform);
    }
  }
  setObbData(s, e) {
    let t = new fn();
    be.set(s[3], s[4], s[5]), ge.set(s[6], s[7], s[8]), xe.set(s[9], s[10], s[11]);
    let n = be.length(), a = ge.length(), i = xe.length();
    be.normalize(), ge.normalize(), xe.normalize(), n === 0 && be.crossVectors(ge, xe), a === 0 && ge.crossVectors(be, xe), i === 0 && xe.crossVectors(be, ge), t.transform.set(be.x, ge.x, xe.x, s[0], be.y, ge.y, xe.y, s[1], be.z, ge.z, xe.z, s[2], 0, 0, 0, 1).premultiply(e), t.box.min.set(-n, -a, -i), t.box.max.set(n, a, i), t.update(), this.obb = t;
  }
  setSphereData(s, e, t, n, a) {
    let i = new Ds();
    i.center.set(s, e, t), i.radius = n, i.applyMatrix4(a), this.sphere = i;
  }
  setRegionData(s, e, t, n, a, i, r) {
    let l = new _r(...s.radius, t, a, e, n, i, r), o = new fn();
    l.getBoundingBox(o.box, o.transform), o.update(), this.region = l, this.regionObb = o;
  }
}, Nr = /* @__PURE__ */ new oa();
function Br(s, e, t, n) {
  let a = Nr.set(s.normal.x, s.normal.y, s.normal.z, e.normal.x, e.normal.y, e.normal.z, t.normal.x, t.normal.y, t.normal.z);
  return n.set(-s.constant, -e.constant, -t.constant), n.applyMatrix3(a.invert()), n;
}
var jr = class extends mi {
  constructor() {
    super(), this.points = Array(8).fill().map(() => new B());
  }
  setFromProjectionMatrix(...s) {
    return super.setFromProjectionMatrix(...s), this.calculateFrustumPoints(), this;
  }
  calculateFrustumPoints() {
    let { planes: s, points: e } = this;
    [
      [
        s[0],
        s[3],
        s[4]
      ],
      [
        s[1],
        s[3],
        s[4]
      ],
      [
        s[0],
        s[2],
        s[4]
      ],
      [
        s[1],
        s[2],
        s[4]
      ],
      [
        s[0],
        s[3],
        s[5]
      ],
      [
        s[1],
        s[3],
        s[5]
      ],
      [
        s[0],
        s[2],
        s[5]
      ],
      [
        s[1],
        s[2],
        s[5]
      ]
    ].forEach((t, n) => {
      Br(t[0], t[1], t[2], e[n]);
    });
  }
}, As = 0;
function xn(s, e, t, n) {
  try {
    return gi.getByteLength(s, e, t, n);
  } catch {
    return As;
  }
}
function Ur(s) {
  if (!s) return 0;
  if (s.isExternalTexture) return s.userData?.byteLength ?? As;
  let { format: e, type: t, image: n, mipmaps: a } = s;
  if (s.isCompressedTexture && Array.isArray(a) && a.length > 0) {
    let r = 0;
    for (let l of a) l?.data?.byteLength ? r += l.data.byteLength : r += xn(l.width, l.height, e, t);
    return r;
  }
  if (!n) return As;
  let i = xn(n.width, n.height, e, t);
  return i *= s.generateMipmaps ? 4 / 3 : 1, i;
}
function Hr(s) {
  let e = /* @__PURE__ */ new Set(), t = 0;
  return s.traverse((n) => {
    if (n.geometry && !e.has(n.geometry) && (t += Gi(n.geometry), e.add(n.geometry)), n.material) {
      let a = n.material;
      for (let i in a) {
        let r = a[i];
        r && r.isTexture && !e.has(r) && (t += Ur(r), e.add(r));
      }
    }
  }), t;
}
var Ma = /* @__PURE__ */ Symbol("INITIAL_FRUSTUM_CULLED"), Ft = /* @__PURE__ */ new W(), tt = /* @__PURE__ */ new B(), ls = /* @__PURE__ */ new se(), Gr = /* @__PURE__ */ new B(1, 0, 0), Vr = /* @__PURE__ */ new B(0, 1, 0), Xr = () => null;
function yn(s, e) {
  s.traverse((t) => {
    t.frustumCulled = t[Ma] && e;
  });
}
var qr = class extends _i {
  get autoDisableRendererCulling() {
    return this._autoDisableRendererCulling;
  }
  set autoDisableRendererCulling(s) {
    this._autoDisableRendererCulling !== s && (super._autoDisableRendererCulling = s, this.forEachLoadedModel((e) => {
      yn(e, !s);
    }));
  }
  constructor(...s) {
    super(...s), this.accelerateRaycast = !0, this.group = new Or(this), this.ellipsoid = Yt.clone(), this.cameras = [], this.cameraMap = /* @__PURE__ */ new Map(), this.cameraInfo = [], this._upRotationMatrix = new W(), this._bytesUsed = /* @__PURE__ */ new WeakMap(), this._autoDisableRendererCulling = !0, this.manager = new hi(), this._listeners = {};
  }
  addEventListener(s, e) {
    vt.prototype.addEventListener.call(this, s, e);
  }
  hasEventListener(s, e) {
    return vt.prototype.hasEventListener.call(this, s, e);
  }
  removeEventListener(s, e) {
    vt.prototype.removeEventListener.call(this, s, e);
  }
  dispatchEvent(s) {
    vt.prototype.dispatchEvent.call(this, s);
  }
  getBoundingBox(s) {
    if (!this.root) return !1;
    let e = this.root.engineData.boundingVolume;
    return e ? (e.getAABB(s), !0) : !1;
  }
  getOrientedBoundingBox(s, e) {
    if (!this.root) return !1;
    let t = this.root.engineData.boundingVolume;
    return t ? (t.getOBB(s, e), !0) : !1;
  }
  getBoundingSphere(s) {
    if (!this.root) return !1;
    let e = this.root.engineData.boundingVolume;
    return e ? (e.getSphere(s), !0) : !1;
  }
  forEachLoadedModel(s) {
    this.traverse((e) => {
      let t = e.engineData && e.engineData.scene;
      t && s(t, e);
    }, null, !1);
  }
  raycast(s, e) {
    if (this.root) if (this.accelerateRaycast) Aa(this, this.root, s, e);
    else {
      let t = s.firstHitOnly ? [] : e;
      for (let n of this.activeTiles) {
        let { scene: a } = n.engineData;
        this.invokeOnePlugin((i) => i.raycastTile && i.raycastTile(n, a, s, t)) || s.intersectObject(a, !0, t);
      }
      s.firstHitOnly && t.length > 0 && (t.sort((n, a) => n.distance - a.distance), e.push(t[0]));
    }
  }
  hasCamera(s) {
    return this.cameraMap.has(s);
  }
  setCamera(s) {
    let e = this.cameras, t = this.cameraMap;
    return t.has(s) ? !1 : (t.set(s, new se()), e.push(s), this.dispatchEvent({
      type: "add-camera",
      camera: s
    }), !0);
  }
  setResolution(s, e, t) {
    let n = this.cameraMap;
    if (!n.has(s)) return !1;
    let a = e.isVector2 ? e.x : e, i = e.isVector2 ? e.y : t, r = n.get(s);
    return (r.width !== a || r.height !== i) && (r.set(a, i), this.dispatchEvent({ type: "camera-resolution-change" })), !0;
  }
  getResolution(s, e) {
    let t = this.cameraMap.get(s);
    return t ? e.copy(t) : null;
  }
  setResolutionFromRenderer(s, e) {
    return e.getSize(ls), this.setResolution(s, ls.x, ls.y);
  }
  deleteCamera(s) {
    let e = this.cameras, t = this.cameraMap;
    if (t.has(s)) {
      let n = e.indexOf(s);
      return e.splice(n, 1), t.delete(s), this.dispatchEvent({
        type: "delete-camera",
        camera: s
      }), !0;
    }
    return !1;
  }
  loadRootTileset(...s) {
    return super.loadRootTileset(...s).then((e) => {
      let { asset: t, extensions: n = {} } = e;
      switch ((t && t.gltfUpAxis || "y").toLowerCase()) {
        case "x":
          this._upRotationMatrix.makeRotationAxis(Vr, -Math.PI / 2);
          break;
        case "y":
          this._upRotationMatrix.makeRotationAxis(Gr, Math.PI / 2);
          break;
      }
      if ("3DTILES_ellipsoid" in n) {
        let a = n["3DTILES_ellipsoid"], { ellipsoid: i } = this;
        i.name = a.body, a.radii ? i.radius.set(...a.radii) : i.radius.set(1, 1, 1);
      }
      return e;
    });
  }
  prepareForTraversal() {
    let s = this.group, e = this.cameras, t = this.cameraMap, n = this.cameraInfo;
    for (; n.length > e.length; ) n.pop();
    for (; n.length < e.length; ) n.push({
      frustum: new jr(),
      isOrthographic: !1,
      sseDenominator: -1,
      position: new B(),
      invScale: -1,
      pixelSize: 0
    });
    tt.setFromMatrixScale(s.matrixWorldInverse), Math.abs(Math.max(tt.x - tt.y, tt.x - tt.z)) > 1e-6 && console.warn("ThreeTilesRenderer : Non uniform scale used for tile which may cause issues when calculating screen space error.");
    for (let a = 0, i = n.length; a < i; a++) {
      let r = e[a], l = n[a], o = l.frustum, c = l.position, d = t.get(r);
      (d.width === 0 || d.height === 0) && console.warn("TilesRenderer: resolution for camera error calculation is not set.");
      let u = r.projectionMatrix.elements;
      if (l.isOrthographic = u[15] === 1, l.isOrthographic) {
        let h = 2 / u[0], f = 2 / u[5];
        l.pixelSize = Math.max(f / d.height, h / d.width);
      } else l.sseDenominator = 2 / u[5] / d.height;
      Ft.copy(s.matrixWorld), Ft.premultiply(r.matrixWorldInverse), Ft.premultiply(r.projectionMatrix), o.setFromProjectionMatrix(Ft, r.coordinateSystem, r.reversedDepth), c.set(0, 0, 0), c.applyMatrix4(r.matrixWorld), c.applyMatrix4(s.matrixWorldInverse);
    }
  }
  update() {
    if (super.update(), this.cameras.length === 0 && this.root) {
      let s = !1;
      this.invokeAllPlugins((e) => s ||= !!(e !== this && e.calculateTileViewError)), s === !1 && console.warn("TilesRenderer: no cameras defined. Cannot update 3d tiles.");
    }
  }
  preprocessNode(s, e, t = null) {
    super.preprocessNode(s, e, t);
    let n = new W();
    if (s.transform) {
      let r = s.transform;
      for (let l = 0; l < 16; l++) n.elements[l] = r[l];
    }
    t && n.premultiply(t.engineData.transform);
    let a = new W().copy(n).invert(), i = new Lr();
    "sphere" in s.boundingVolume && i.setSphereData(...s.boundingVolume.sphere, n), "box" in s.boundingVolume && i.setObbData(s.boundingVolume.box, n), "region" in s.boundingVolume && i.setRegionData(this.ellipsoid, ...s.boundingVolume.region), s.engineData.transform = n, s.engineData.transformInverse = a, s.engineData.boundingVolume = i, s.engineData.geometry = null, s.engineData.materials = null, s.engineData.textures = null, s.toJSON = Xr;
  }
  async parseTile(s, e, t, n, a) {
    let i = e.engineData, r = _s(n), l = this.fetchOptions, o = this.manager, c = null, d = i.transform, u = this._upRotationMatrix, h = (We(s) || t).toLowerCase();
    switch (h) {
      case "b3dm": {
        let m = new ya(o);
        m.workingPath = r, m.fetchOptions = l, m.adjustmentTransform.copy(u), c = m.parse(s);
        break;
      }
      case "pnts": {
        let m = new va(o);
        m.workingPath = r, m.fetchOptions = l, c = m.parse(s);
        break;
      }
      case "i3dm": {
        let m = new Ta(o);
        m.workingPath = r, m.fetchOptions = l, m.adjustmentTransform.copy(u), m.ellipsoid.copy(this.ellipsoid), c = m.parse(s);
        break;
      }
      case "cmpt": {
        let m = new kr(o);
        m.workingPath = r, m.fetchOptions = l, m.adjustmentTransform.copy(u), m.ellipsoid.copy(this.ellipsoid), c = m.parse(s).then((v) => v.scene);
        break;
      }
      case "gltf":
      case "glb": {
        let m = o.getHandler("path.gltf") || o.getHandler("path.glb") || new Kt(o);
        m.setWithCredentials(l.credentials === "include"), m.setRequestHeader(l.headers || {}), l.credentials === "include" && l.mode === "cors" && m.setCrossOrigin("use-credentials");
        let v = m.resourcePath || m.path || r;
        !/[\\/]$/.test(v) && v.length && (v += "/"), c = m.parseAsync(s, v).then((w) => {
          w.scene = w.scene || new Xe();
          let { scene: T } = w;
          return T.updateMatrix(), T.matrix.multiply(u).decompose(T.position, T.quaternion, T.scale), w;
        });
        break;
      }
      default:
        c = this.invokeOnePlugin((m) => m.parseToMesh && m.parseToMesh(s, e, t, n, a));
        break;
    }
    let f = await c;
    if (f === null) throw Error(`TilesRenderer: Content type "${h}" not supported.`);
    let p, y;
    f.isObject3D ? (p = f, y = null) : (p = f.scene, y = f), p.updateMatrix(), p.matrix.premultiply(d), p.matrix.decompose(p.position, p.quaternion, p.scale), await this.invokeAllPlugins((m) => m.processTileModel && m.processTileModel(p, e)), p.traverse((m) => {
      m[Ma] = m.frustumCulled, m.userData.tile = e;
    }), yn(p, !this.autoDisableRendererCulling);
    let g = [], b = [], x = [];
    if (p.traverse((m) => {
      if (m.geometry && b.push(m.geometry), m.material) {
        let v = m.material;
        g.push(m.material);
        for (let w in v) {
          let T = v[w];
          T && T.isTexture && x.push(T);
        }
      }
    }), a.aborted) {
      for (let m = 0, v = x.length; m < v; m++) {
        let w = x[m];
        w.image instanceof ImageBitmap && w.image.close(), w.dispose();
      }
      return;
    }
    i.materials = g, i.geometry = b, i.textures = x, i.scene = p, i.metadata = y;
  }
  disposeTile(s) {
    super.disposeTile(s);
    let e = s.engineData;
    if (e.scene) {
      let t = e.materials, n = e.geometry, a = e.textures, i = e.scene.parent;
      e.scene.traverse((r) => {
        r.userData.meshFeatures && r.userData.meshFeatures.dispose(), r.userData.structuralMetadata && r.userData.structuralMetadata.dispose();
      });
      for (let r = 0, l = n.length; r < l; r++) n[r].dispose();
      for (let r = 0, l = t.length; r < l; r++) t[r].dispose();
      for (let r = 0, l = a.length; r < l; r++) {
        let o = a[r];
        o.image instanceof ImageBitmap && o.image.close(), o.dispose();
      }
      i && i.remove(e.scene), e.scene = null, e.materials = null, e.textures = null, e.geometry = null, e.metadata = null;
    }
  }
  setTileActive(s, e) {
    super.setTileActive(s, e);
    let t = s.engineData.scene;
    t && (e ? (t.parent = this.group, t.updateMatrixWorld(!0)) : t.parent = null);
  }
  setTileVisible(s, e) {
    let t = s.engineData.scene, { activeTiles: n, group: a } = this;
    t && (e ? a.add(t) : (a.remove(t), n.has(s) && (t.parent = a))), super.setTileVisible(s, e);
  }
  calculateBytesUsed(s, e) {
    let t = this._bytesUsed;
    return !t.has(s) && e && t.set(s, Hr(e)), t.get(s) ?? null;
  }
  calculateTileViewError(s, e) {
    let t = s.engineData, n = this.cameras, a = this.cameraInfo, i = t.boundingVolume, r = !1, l = 0, o = 1 / 0, c = 0, d = 1 / 0;
    for (let u = 0, h = n.length; u < h; u++) {
      let f = a[u], p, y;
      if (f.isOrthographic) {
        let b = f.pixelSize;
        p = s.geometricError / b, y = 1 / 0;
      } else {
        let b = f.sseDenominator;
        y = i.distanceToPoint(f.position), p = y === 0 ? 1 / 0 : s.geometricError / (y * b);
      }
      let g = a[u].frustum;
      i.intersectsFrustum(g) && (r = !0, l = Math.max(l, p), o = Math.min(o, y)), c = Math.max(c, p), d = Math.min(d, y);
    }
    r ? (e.inView = !0, e.error = l, e.distanceFromCamera = o) : (e.inView = !1, e.error = c, e.distanceFromCamera = d);
  }
  dispose() {
    super.dispose(), this.group.removeFromParent();
  }
};
const Zr = new ia(-1, 1, 1, -1, 0, 1);
class Wr extends Os {
  constructor() {
    super(), this.setAttribute("position", new Xs([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3)), this.setAttribute("uv", new Xs([0, 2, 0, 0, 2, 0], 2));
  }
}
const Kr = new Wr();
class Sa {
  /**
   * Constructs a new full screen quad.
   *
   * @param {?Material} material - The material to render te full screen quad with.
   */
  constructor(e) {
    this._mesh = new na(Kr, e);
  }
  /**
   * Frees the GPU-related resources allocated by this instance. Call this
   * method whenever the instance is no longer used in your app.
   */
  dispose() {
    this._mesh.geometry.dispose();
  }
  /**
   * Renders the full screen quad.
   *
   * @param {WebGLRenderer} renderer - The renderer.
   */
  render(e) {
    e.render(this._mesh, Zr);
  }
  /**
   * The quad's material.
   *
   * @type {?Material}
   */
  get material() {
    return this._mesh.material;
  }
  set material(e) {
    this._mesh.material = e;
  }
}
var vn = /* @__PURE__ */ new bt();
vn.maxJobs = 10, vn.priorityCallback = (s, e) => {
  let t = s.tile, n = e.tile, a = t.internal.renderer, i = n.internal.renderer, r = a.visibleTiles.has(t);
  return r === i.visibleTiles.has(n) ? qt(t, n) : r ? 1 : -1;
};
var wn = /* @__PURE__ */ new B();
function st(s, e) {
  if (s.isInterleavedBufferAttribute || s.array instanceof e) return s;
  let t = e === Int8Array || e === Int16Array || e === Int32Array ? -1 : 0, n = new le(new e(s.count * s.itemSize), s.itemSize, !0), a = s.itemSize, i = s.count;
  for (let r = 0; r < i; r++) for (let l = 0; l < a; l++) {
    let o = Ke.clamp(s.getComponent(r, l), t, 1);
    n.setComponent(r, l, o);
  }
  return n;
}
function Yr(s, e = Int16Array) {
  let t = s.geometry, n = t.attributes, a = n.position;
  if (a.isInterleavedBufferAttribute || a.array instanceof e) return a;
  let i = new le(new e(a.count * a.itemSize), a.itemSize, !1), r = a.itemSize, l = a.count;
  t.computeBoundingBox();
  let o = t.boundingBox, { min: c, max: d } = o, u = 2 ** (8 * e.BYTES_PER_ELEMENT - 1) - 1, h = -u;
  for (let f = 0; f < l; f++) for (let p = 0; p < r; p++) {
    let y = p === 0 ? "x" : p === 1 ? "y" : "z", g = c[y], b = d[y], x = Ke.mapLinear(a.getComponent(f, p), g, b, h, u);
    i.setComponent(f, p, x);
  }
  o.getCenter(wn).multiply(s.scale).applyQuaternion(s.quaternion), s.position.add(wn), s.scale.x *= 0.5 * (d.x - c.x) / u, s.scale.y *= 0.5 * (d.y - c.y) / u, s.scale.z *= 0.5 * (d.z - c.z) / u, n.position = i, s.geometry.boundingBox = null, s.geometry.boundingSphere = null, s.updateMatrixWorld();
}
var Qr = class {
  constructor(s) {
    this._options = {
      generateNormals: !1,
      disableMipmaps: !0,
      compressIndex: !0,
      compressNormals: !1,
      compressUvs: !1,
      compressPosition: !1,
      uvType: Int8Array,
      normalType: Int8Array,
      positionType: Int16Array,
      ...s
    }, this.name = "TILES_COMPRESSION_PLUGIN", this.priority = -100;
  }
  processTileModel(s, e) {
    let { generateNormals: t, disableMipmaps: n, compressIndex: a, compressUvs: i, compressNormals: r, compressPosition: l, uvType: o, normalType: c, positionType: d } = this._options;
    s.traverse((u) => {
      if (u.material && n) {
        let h = u.material;
        for (let f in h) {
          let p = h[f];
          p && p.isTexture && p.generateMipmaps && (p.generateMipmaps = !1, p.minFilter = Dt);
        }
      }
      if (u.geometry) {
        let h = u.geometry, f = h.attributes;
        if (i) {
          let { uv: p, uv1: y, uv2: g, uv3: b } = f;
          p && (f.uv = st(p, o)), y && (f.uv1 = st(y, o)), g && (f.uv2 = st(g, o)), b && (f.uv3 = st(b, o));
        }
        if (t && !f.normals && h.computeVertexNormals(), r && f.normals && (f.normals = st(f.normals, c)), l && Yr(u, d), a && h.index) {
          let p = f.position.count, y = h.index, g = p > 65535 ? Uint32Array : p > 255 ? Uint16Array : Uint8Array;
          if (!(y.array instanceof g)) {
            let b = new g(h.index.count);
            b.set(y.array);
            let x = new le(b, 1);
            h.setIndex(x);
          }
        }
      }
    });
  }
};
function $(s, e, t) {
  return s && e in s ? s[e] : t;
}
function Ra(s) {
  return s !== "BOOLEAN" && s !== "STRING" && s !== "ENUM";
}
function Jr(s) {
  return /^FLOAT/.test(s);
}
function xt(s) {
  return /^VEC/.test(s);
}
function yt(s) {
  return /^MAT/.test(s);
}
function Ea(s, e, t, n = null) {
  return yt(t) || xt(t) ? n.fromArray(s, e) : s[e];
}
function Ms(s) {
  let { type: e, componentType: t } = s;
  switch (e) {
    case "SCALAR":
      return t === "INT64" ? 0n : 0;
    case "VEC2":
      return new se();
    case "VEC3":
      return new B();
    case "VEC4":
      return new Si();
    case "MAT2":
      return new Mi();
    case "MAT3":
      return new oa();
    case "MAT4":
      return new W();
    case "BOOLEAN":
      return !1;
    case "STRING":
      return "";
    case "ENUM":
      return 0;
  }
}
function Tn(s, e) {
  if (e == null) return !1;
  switch (s) {
    case "SCALAR":
      return typeof e == "number" || typeof e == "bigint";
    case "VEC2":
      return e.isVector2;
    case "VEC3":
      return e.isVector3;
    case "VEC4":
      return e.isVector4;
    case "MAT2":
      return e.isMatrix2;
    case "MAT3":
      return e.isMatrix3;
    case "MAT4":
      return e.isMatrix4;
    case "BOOLEAN":
      return typeof e == "boolean";
    case "STRING":
      return typeof e == "string";
    case "ENUM":
      return typeof e == "number" || typeof e == "bigint";
  }
  throw Error("ClassProperty: invalid type.");
}
function ft(s, e = null) {
  switch (s) {
    case "INT8":
      return Int8Array;
    case "INT16":
      return Int16Array;
    case "INT32":
      return Int32Array;
    case "INT64":
      return BigInt64Array;
    case "UINT8":
      return Uint8Array;
    case "UINT16":
      return Uint16Array;
    case "UINT32":
      return Uint32Array;
    case "UINT64":
      return BigUint64Array;
    case "FLOAT32":
      return Float32Array;
    case "FLOAT64":
      return Float64Array;
  }
  switch (e) {
    case "BOOLEAN":
      return Uint8Array;
    case "STRING":
      return Uint8Array;
  }
  throw Error("ClassProperty: invalid type.");
}
function $r(s, e = null) {
  if (s.array) {
    e = e && Array.isArray(e) ? e : [], e.length = s.count;
    for (let t = 0, n = e.length; t < n; t++) e[t] = Bt(s, e[t]);
  } else e = Bt(s, e);
  return e;
}
function Bt(s, e = null) {
  let t = s.default, n = s.type;
  if (e ||= Ms(s), t === null) {
    switch (n) {
      case "SCALAR":
        return 0;
      case "VEC2":
        return e.set(0, 0);
      case "VEC3":
        return e.set(0, 0, 0);
      case "VEC4":
        return e.set(0, 0, 0, 0);
      case "MAT2":
        return e.identity();
      case "MAT3":
        return e.identity();
      case "MAT4":
        return e.identity();
      case "BOOLEAN":
        return !1;
      case "STRING":
        return "";
      case "ENUM":
        return "";
    }
    throw Error("ClassProperty: invalid type.");
  } else if (yt(n)) e.fromArray(t);
  else if (xt(n)) e.fromArray(t);
  else return t;
}
function eo(s, e) {
  if (s.noData === null) return e;
  let t = s.noData, n = s.type;
  if (Array.isArray(e)) for (let r = 0, l = e.length; r < l; r++) e[r] = a(e[r]);
  else e = a(e);
  return e;
  function a(r) {
    return i(r) && (r = Bt(s, r)), r;
  }
  function i(r) {
    if (yt(n)) {
      let l = r.elements;
      for (let o = 0, c = t.length; o < c; o++) if (t[o] !== l[o]) return !1;
      return !0;
    } else if (xt(n)) {
      for (let l = 0, o = t.length; l < o; l++) if (t[l] !== r.getComponent(l)) return !1;
      return !0;
    } else return t === r;
  }
}
function to(s, e) {
  switch (s) {
    case "INT8":
      return Math.max(e / 127, -1);
    case "INT16":
      return Math.max(e, 32767, -1);
    case "INT32":
      return Math.max(e / 2147483647, -1);
    case "INT64":
      return Math.max(Number(e) / 9223372036854776e3, -1);
    case "UINT8":
      return e / 255;
    case "UINT16":
      return e / 65535;
    case "UINT32":
      return e / 4294967295;
    case "UINT64":
      return Number(e) / 18446744073709552e3;
  }
}
function so(s, e) {
  let { type: t, componentType: n, scale: a, offset: i, normalized: r } = s;
  if (Array.isArray(e)) for (let u = 0, h = e.length; u < h; u++) e[u] = l(e[u]);
  else e = l(e);
  return e;
  function l(u) {
    return u = yt(t) ? c(u) : xt(t) ? o(u) : d(u), u;
  }
  function o(u) {
    return u.x = d(u.x), u.y = d(u.y), "z" in u && (u.z = d(u.z)), "w" in u && (u.w = d(u.w)), u;
  }
  function c(u) {
    let h = u.elements;
    for (let f = 0, p = h.length; f < p; f++) h[f] = d(h[f]);
    return u;
  }
  function d(u) {
    return r && (u = to(n, u)), (r || Jr(n)) && (u = u * a + i), u;
  }
}
function Ns(s, e, t = null) {
  if (s.array) {
    Array.isArray(e) || (e = Array(s.count || 0)), e.length = t === null ? s.count : t;
    for (let n = 0, a = e.length; n < a; n++) Tn(s.type, e[n]) || (e[n] = Ms(s));
  } else Tn(s.type, e) || (e = Ms(s));
  return e;
}
function jt(s, e) {
  for (let t in e) t in s || delete e[t];
  for (let t in s) {
    let n = s[t];
    e[t] = Ns(n, e[t]);
  }
}
function no(s) {
  switch (s) {
    case "ENUM":
      return 1;
    case "SCALAR":
      return 1;
    case "VEC2":
      return 2;
    case "VEC3":
      return 3;
    case "VEC4":
      return 4;
    case "MAT2":
      return 4;
    case "MAT3":
      return 9;
    case "MAT4":
      return 16;
    case "BOOLEAN":
      return -1;
    case "STRING":
      return -1;
    default:
      return -1;
  }
}
var Qt = class {
  constructor(s, e, t = null) {
    this.name = e.name || null, this.description = e.description || null, this.type = e.type, this.componentType = e.componentType || null, this.enumType = e.enumType || null, this.array = e.array || !1, this.count = e.count || 0, this.normalized = e.normalized || !1, this.offset = e.offset || 0, this.scale = $(e, "scale", 1), this.max = $(e, "max", 1 / 0), this.min = $(e, "min", -1 / 0), this.required = e.required || !1, this.noData = $(e, "noData", null), this.default = $(e, "default", null), this.semantic = $(e, "semantic", null), this.enumSet = null, this.accessorProperty = t, t && (this.offset = $(t, "offset", this.offset), this.scale = $(t, "scale", this.scale), this.max = $(t, "max", this.max), this.min = $(t, "min", this.min)), e.type === "ENUM" && (this.enumSet = s[this.enumType], this.componentType === null && (this.componentType = $(this.enumSet, "valueType", "UINT16")));
  }
  shapeToProperty(s, e = null) {
    return Ns(this, s, e);
  }
  resolveDefaultElement(s) {
    return Bt(this, s);
  }
  resolveDefault(s) {
    return $r(this, s);
  }
  resolveNoData(s) {
    return eo(this, s);
  }
  resolveEnumsToStrings(s) {
    let e = this.enumSet;
    if (this.type === "ENUM") if (Array.isArray(s)) for (let n = 0, a = s.length; n < a; n++) s[n] = t(s[n]);
    else s = t(s);
    return s;
    function t(n) {
      let a = e.values.find((i) => i.value === n);
      return a === null ? "" : a.name;
    }
  }
  adjustValueScaleOffset(s) {
    return Ra(this.type) ? so(this, s) : s;
  }
}, Bs = class {
  constructor(s, e = {}, t = {}, n = null) {
    this.definition = s, this.class = e[s.class], this.className = s.class, this.enums = t, this.data = n, this.name = "name" in s ? s.name : null, this.properties = null;
  }
  getPropertyNames() {
    return Object.keys(this.class.properties);
  }
  includesData(s) {
    return !!this.definition.properties[s];
  }
  dispose() {
  }
  _initProperties(s = Qt) {
    let e = {};
    for (let t in this.class.properties) e[t] = new s(this.enums, this.class.properties[t], this.definition.properties[t]);
    this.properties = e;
  }
}, ao = class extends Qt {
  constructor(s, e, t = null) {
    super(s, e, t), this.attribute = t?.attribute ?? null;
  }
}, io = class extends Bs {
  constructor(...s) {
    super(...s), this.isPropertyAttributeAccessor = !0, this._initProperties(ao);
  }
  getData(s, e, t = {}) {
    let n = this.properties;
    jt(n, t);
    for (let a in n) t[a] = this.getPropertyValue(a, s, e, t[a]);
    return t;
  }
  getPropertyValue(s, e, t, n = null) {
    if (e >= this.count) throw Error("PropertyAttributeAccessor: Requested index is outside the range of the buffer.");
    let a = this.properties[s], i = a.type;
    if (!a) throw Error("PropertyAttributeAccessor: Requested class property does not exist.");
    if (!this.definition.properties[s]) return a.resolveDefault(n);
    n = a.shapeToProperty(n);
    let r = t.getAttribute(a.attribute.toLowerCase());
    if (yt(i)) {
      let l = n.elements;
      for (let o = l.length; 0 < o; ) l[0] = r.getComponent(e, 0);
    } else if (xt(i)) n.fromBufferAttribute(r, e);
    else if (i === "SCALAR" || i === "ENUM") n = r.getX(e);
    else throw Error("StructuredMetadata.PropertyAttributeAccessor: BOOLEAN and STRING types are not supported by property attributes.");
    return n = a.adjustValueScaleOffset(n), n = a.resolveEnumsToStrings(n), n = a.resolveNoData(n), n;
  }
}, ro = class extends Qt {
  constructor(s, e, t = null) {
    super(s, e, t), this.values = t?.values ?? null, this.valueLength = no(this.type), this.arrayOffsets = $(t, "arrayOffsets", null), this.stringOffsets = $(t, "stringOffsets", null), this.arrayOffsetType = $(t, "arrayOffsetType", "UINT32"), this.stringOffsetType = $(t, "stringOffsetType", "UINT32");
  }
  getArrayLengthFromId(s, e) {
    let t = this.count;
    if (this.arrayOffsets !== null) {
      let { arrayOffsets: n, arrayOffsetType: a } = this, i = new (ft(a))(s[n]);
      t = i[e + 1] - i[e];
    }
    return t;
  }
  getIndexOffsetFromId(s, e) {
    let t = e;
    if (this.arrayOffsets) {
      let { arrayOffsets: n, arrayOffsetType: a } = this;
      t = new (ft(a))(s[n])[t];
    } else this.array && (t *= this.count);
    return t;
  }
}, oo = class extends Bs {
  constructor(...s) {
    super(...s), this.isPropertyTableAccessor = !0, this.count = this.definition.count, this._initProperties(ro);
  }
  getData(s, e = {}) {
    let t = this.properties;
    jt(t, e);
    for (let n in t) e[n] = this.getPropertyValue(n, s, e[n]);
    return e;
  }
  _readValueAtIndex(s, e, t, n = null) {
    let a = this.properties[s], { componentType: i, type: r } = a, l = this.data, o = l[a.values], c = new (ft(i, r))(o), d = a.getIndexOffsetFromId(l, e);
    if (Ra(r) || r === "ENUM") return Ea(c, (d + t) * a.valueLength, r, n);
    if (r === "STRING") {
      let u = d + t, h = 0;
      if (a.stringOffsets !== null) {
        let { stringOffsets: p, stringOffsetType: y } = a, g = new (ft(y))(l[p]);
        h = g[u + 1] - g[u], u = g[u];
      }
      let f = new Uint8Array(c.buffer, u, h);
      n = new TextDecoder().decode(f);
    } else if (r === "BOOLEAN") {
      let u = d + t, h = Math.floor(u / 8), f = u % 8;
      n = (c[h] >> f & 1) == 1;
    }
    return n;
  }
  getPropertyValue(s, e, t = null) {
    if (e >= this.count) throw Error("PropertyTableAccessor: Requested index is outside the range of the table.");
    let n = this.properties[s];
    if (!n) throw Error("PropertyTableAccessor: Requested property does not exist.");
    if (!this.definition.properties[s]) return n.resolveDefault(t);
    let a = n.array, i = this.data, r = n.getArrayLengthFromId(i, e);
    if (t = n.shapeToProperty(t, r), a) for (let l = 0, o = t.length; l < o; l++) t[l] = this._readValueAtIndex(s, e, l, t[l]);
    else t = this._readValueAtIndex(s, e, 0, t);
    return t = n.adjustValueScaleOffset(t), t = n.resolveEnumsToStrings(t), t = n.resolveNoData(t), t;
  }
}, nt = /* @__PURE__ */ new Ai(), An = class {
  constructor() {
    this._renderer = new xi(), this._target = new qs(1, 1), this._texTarget = new qs(), this._quad = new Sa(new yi({
      blending: Ti,
      blendDst: wi,
      blendSrc: vi,
      uniforms: {
        map: { value: null },
        pixel: { value: new se() }
      },
      vertexShader: `
				void main() {

					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}
			`,
      fragmentShader: `
				uniform sampler2D map;
				uniform ivec2 pixel;

				void main() {

					gl_FragColor = texelFetch( map, pixel, 0 );

				}
			`
    }));
  }
  increaseSizeTo(s) {
    this._target.setSize(Math.max(this._target.width, s), 1);
  }
  readDataAsync(s) {
    let { _renderer: e, _target: t } = this;
    return e.readRenderTargetPixelsAsync(t, 0, 0, s.length / 4, 1, s);
  }
  readData(s) {
    let { _renderer: e, _target: t } = this;
    e.readRenderTargetPixels(t, 0, 0, s.length / 4, 1, s);
  }
  renderPixelToTarget(s, e, t) {
    let { _renderer: n, _target: a } = this;
    nt.min.copy(e), nt.max.copy(e), nt.max.x += 1, nt.max.y += 1, n.initRenderTarget(a), n.copyTextureToTexture(s, a.texture, nt, t, 0);
  }
}, ke = /* @__PURE__ */ new class {
  constructor() {
    let s = null;
    Object.getOwnPropertyNames(An.prototype).forEach((e) => {
      e !== "constructor" && (this[e] = (...t) => (s ||= new An(), s[e](...t)));
    });
  }
}(), Mn = /* @__PURE__ */ new se(), Sn = /* @__PURE__ */ new se(), Rn = /* @__PURE__ */ new se();
function lo(s, e) {
  return e === 0 ? s.getAttribute("uv") : s.getAttribute(`uv${e}`);
}
function Ca(s, e, t = [
  ,
  ,
  ,
]) {
  let n = 3 * e, a = 3 * e + 1, i = 3 * e + 2;
  return s.index && (n = s.index.getX(n), a = s.index.getX(a), i = s.index.getX(i)), t[0] = n, t[1] = a, t[2] = i, t;
}
function Fa(s, e, t, n, a) {
  let [i, r, l] = n, o = lo(s, e);
  Mn.fromBufferAttribute(o, i), Sn.fromBufferAttribute(o, r), Rn.fromBufferAttribute(o, l), a.set(0, 0, 0).addScaledVector(Mn, t.x).addScaledVector(Sn, t.y).addScaledVector(Rn, t.z);
}
function ka(s, e, t, n) {
  let a = s.x - Math.floor(s.x), i = s.y - Math.floor(s.y), r = Math.floor(a * e % e), l = Math.floor(i * t % t);
  return n.set(r, l), n;
}
var En = /* @__PURE__ */ new se(), Cn = /* @__PURE__ */ new se(), Fn = /* @__PURE__ */ new se(), co = class extends Qt {
  constructor(s, e, t = null) {
    super(s, e, t), this.channels = $(t, "channels", [0]), this.index = $(t, "index", null), this.texCoord = $(t, "texCoord", null), this.valueLength = parseInt(this.type.replace(/[^0-9]/g, "")) || 1;
  }
  readDataFromBuffer(s, e, t = null) {
    let n = this.type;
    if (n === "BOOLEAN" || n === "STRING") throw Error("PropertyTextureAccessor: BOOLEAN and STRING types not supported.");
    return Ea(s, e * this.valueLength, n, t);
  }
}, uo = class extends Bs {
  constructor(...s) {
    super(...s), this.isPropertyTextureAccessor = !0, this._asyncRead = !1, this._initProperties(co);
  }
  getData(s, e, t, n = {}) {
    let a = this.properties;
    jt(a, n);
    let i = Object.keys(a), r = i.map((l) => n[l]);
    return this.getPropertyValuesAtTexel(i, s, e, t, r), i.forEach((l, o) => n[l] = r[o]), n;
  }
  async getDataAsync(s, e, t, n = {}) {
    let a = this.properties;
    jt(a, n);
    let i = Object.keys(a), r = i.map((l) => n[l]);
    return await this.getPropertyValuesAtTexelAsync(i, s, e, t, r), i.forEach((l, o) => n[l] = r[o]), n;
  }
  getPropertyValuesAtTexelAsync(...s) {
    this._asyncRead = !0;
    let e = this.getPropertyValuesAtTexel(...s);
    return this._asyncRead = !1, e;
  }
  getPropertyValuesAtTexel(s, e, t, n, a = []) {
    for (; a.length < s.length; ) a.push(null);
    a.length = s.length, ke.increaseSizeTo(a.length);
    let i = this.data, r = this.definition.properties, l = this.properties, o = Ca(n, e);
    for (let u = 0, h = s.length; u < h; u++) {
      let f = s[u];
      if (!r[f]) continue;
      let p = l[f], y = i[p.index];
      Fa(n, p.texCoord, t, o, En), ka(En, y.image.width, y.image.height, Cn), Fn.set(u, 0), ke.renderPixelToTarget(y, Cn, Fn);
    }
    let c = new Uint8Array(s.length * 4);
    if (this._asyncRead) return ke.readDataAsync(c).then(() => (d.call(this), a));
    return ke.readData(c), d.call(this), a;
    function d() {
      for (let u = 0, h = s.length; u < h; u++) {
        let f = s[u], p = l[f], y = p.type;
        if (a[u] = Ns(p, a[u]), !p) throw Error("PropertyTextureAccessor: Requested property does not exist.");
        if (!r[f]) {
          a[u] = p.resolveDefault(a);
          continue;
        }
        let g = p.valueLength * (p.count || 1), b = p.channels.map((v) => c[4 * u + v]), x = p.componentType, m = new (ft(x, y))(g);
        if (new Uint8Array(m.buffer).set(b), p.array) {
          let v = a[u];
          for (let w = 0, T = v.length; w < T; w++) v[w] = p.readDataFromBuffer(m, w, v[w]);
        } else a[u] = p.readDataFromBuffer(m, 0, a[u]);
        a[u] = p.adjustValueScaleOffset(a[u]), a[u] = p.resolveEnumsToStrings(a[u]), a[u] = p.resolveNoData(a[u]);
      }
    }
  }
  dispose() {
    this.data.forEach((s) => {
      s && (s.dispose(), s.image instanceof ImageBitmap && s.image.close());
    });
  }
}, kn = class {
  constructor(s, e, t, n = null, a = null) {
    let { schema: i, propertyTables: r = [], propertyTextures: l = [], propertyAttributes: o = [] } = s, { enums: c, classes: d } = i, u = r.map((p) => new oo(p, d, c, t)), h = [], f = [];
    n && (n.propertyTextures && (h = n.propertyTextures.map((p) => new uo(l[p], d, c, e))), n.propertyAttributes && (f = n.propertyAttributes.map((p) => new io(o[p], d, c)))), this.schema = i, this.tableAccessors = u, this.textureAccessors = h, this.attributeAccessors = f, this.object = a, this.textures = e, this.nodeMetadata = n;
  }
  getPropertyTableData(s, e, t = null) {
    if (!Array.isArray(s)) t ||= {}, t = this.tableAccessors[s].getData(e, t);
    else {
      t ||= [];
      let n = Math.min(s.length, e.length);
      t.length = n;
      for (let a = 0; a < n; a++) {
        let i = this.tableAccessors[s[a]];
        t[a] = i.getData(e[a], t[a]);
      }
    }
    if (Array.isArray(s) !== Array.isArray(t) || Array.isArray(s) !== Array.isArray(e)) throw Error("StructuralMetadata: Scalar and array inputs cannot be mixed.");
    return t;
  }
  getPropertyTableInfo(s = null) {
    if (s === null && (s = this.tableAccessors.map((e, t) => t)), Array.isArray(s)) return s.map((e) => {
      let t = this.tableAccessors[e];
      return {
        name: t.name,
        className: t.definition.class
      };
    });
    {
      let e = this.tableAccessors[s];
      return {
        name: e.name,
        className: e.definition.class
      };
    }
  }
  getPropertyTextureData(s, e, t = []) {
    let n = this.textureAccessors;
    t.length = n.length;
    for (let a = 0; a < n.length; a++) t[a] = n[a].getData(s, e, this.object.geometry, t[a]);
    return t;
  }
  async getPropertyTextureDataAsync(s, e, t = []) {
    let n = this.textureAccessors;
    t.length = n.length;
    let a = [];
    for (let i = 0; i < n.length; i++) {
      let r = n[i].getDataAsync(s, e, this.object.geometry, t[i]).then((l) => {
        t[i] = l;
      });
      a.push(r);
    }
    return await Promise.all(a), t;
  }
  getPropertyTextureInfo() {
    return this.textureAccessors;
  }
  getPropertyAttributeData(s, e = []) {
    let t = this.attributeAccessors;
    e.length = t.length;
    for (let n = 0; n < t.length; n++) e[n] = t[n].getData(s, this.object.geometry, e[n]);
    return e;
  }
  getPropertyAttributeInfo() {
    return this.attributeAccessors.map((s) => ({
      name: s.name,
      className: s.definition.class
    }));
  }
  dispose() {
    this.textureAccessors.forEach((s) => s.dispose()), this.tableAccessors.forEach((s) => s.dispose()), this.attributeAccessors.forEach((s) => s.dispose());
  }
}, at = "EXT_structural_metadata";
function ho(s, e = []) {
  let t = s.json.textures?.length || 0, n = Array(t).fill(null);
  return e.forEach(({ properties: a }) => {
    for (let i in a) {
      let { index: r } = a[i];
      n[r] === null && (n[r] = s.loadTexture(r));
    }
  }), Promise.all(n);
}
function fo(s, e = []) {
  let t = s.json.bufferViews?.length || 0, n = Array(t).fill(null);
  return e.forEach(({ properties: a }) => {
    for (let i in a) {
      let { values: r, arrayOffsets: l, stringOffsets: o } = a[i];
      n[r] === null && (n[r] = s.getDependency("bufferView", r)), n[l] === null && (n[l] = s.getDependency("bufferView", l)), n[o] === null && (n[o] = s.getDependency("bufferView", o));
    }
  }), Promise.all(n);
}
var po = class {
  constructor(s) {
    this.parser = s, this.name = at;
  }
  async afterRoot({ scene: s, parser: e }) {
    let t = e.json.extensionsUsed;
    if (!t || !t.includes(at)) return;
    let n = null, a = e.json.extensions[at];
    if (a.schemaUri) {
      let { manager: o, path: c, requestHeader: d, crossOrigin: u } = e.options, h = new URL(a.schemaUri, c).toString(), f = new ks(o);
      f.setCrossOrigin(u), f.setResponseType("json"), f.setRequestHeader(d), n = f.loadAsync(h).then((p) => {
        a = {
          ...a,
          schema: p
        };
      });
    }
    let [i, r] = await Promise.all([
      ho(e, a.propertyTextures),
      fo(e, a.propertyTables),
      n
    ]), l = new kn(a, i, r);
    s.userData.structuralMetadata = l, s.traverse((o) => {
      if (e.associations.has(o)) {
        let { meshes: c, primitives: d } = e.associations.get(o), u = e.json.meshes[c]?.primitives[d];
        if (u && u.extensions && u.extensions[at]) {
          let h = u.extensions[at];
          o.userData.structuralMetadata = new kn(a, i, r, h, o);
        } else o.userData.structuralMetadata = l;
      }
    });
  }
}, On = /* @__PURE__ */ new se(), In = /* @__PURE__ */ new se(), Dn = /* @__PURE__ */ new se();
function mo(s) {
  return s.x > s.y && s.x > s.z ? 0 : s.y > s.z ? 1 : 2;
}
var bo = class {
  constructor(s, e, t) {
    this.geometry = s, this.textures = e, this.data = t, this._asyncRead = !1, this.featureIds = t.featureIds.map((n) => {
      let { texture: a, ...i } = n, r = {
        label: null,
        propertyTable: null,
        nullFeatureId: null,
        ...i
      };
      return a && (r.texture = {
        texCoord: 0,
        channels: [0],
        ...a
      }), r;
    });
  }
  getTextures() {
    return this.textures;
  }
  getFeatureInfo() {
    return this.featureIds;
  }
  getFeaturesAsync(...s) {
    this._asyncRead = !0;
    let e = this.getFeatures(...s);
    return this._asyncRead = !1, e;
  }
  getFeatures(s, e) {
    let { geometry: t, textures: n, featureIds: a } = this, i = Array(a.length).fill(null), r = a.length;
    ke.increaseSizeTo(r);
    let l = Ca(t, s), o = l[mo(e)];
    for (let u = 0, h = a.length; u < h; u++) {
      let f = a[u], p = "nullFeatureId" in f ? f.nullFeatureId : null;
      if ("texture" in f) {
        let y = n[f.texture.index];
        Fa(t, f.texture.texCoord, e, l, On), ka(On, y.image.width, y.image.height, In), Dn.set(u, 0), ke.renderPixelToTarget(n[f.texture.index], In, Dn);
      } else if ("attribute" in f) {
        let y = t.getAttribute(`_feature_id_${f.attribute}`).getX(o);
        y !== p && (i[u] = y);
      } else {
        let y = o;
        y !== p && (i[u] = y);
      }
    }
    let c = new Uint8Array(r * 4);
    if (this._asyncRead) return ke.readDataAsync(c).then(() => (d(), i));
    return ke.readData(c), d(), i;
    function d() {
      let u = new Uint32Array(1);
      for (let h = 0, f = a.length; h < f; h++) {
        let p = a[h], y = "nullFeatureId" in p ? p.nullFeatureId : null;
        if ("texture" in p) {
          let { channels: g } = p.texture, b = g.map((m) => c[4 * h + m]);
          new Uint8Array(u.buffer).set(b);
          let x = u[0];
          x !== y && (i[h] = x);
        }
      }
    }
  }
  dispose() {
    this.textures.forEach((s) => {
      s && (s.dispose(), s.image instanceof ImageBitmap && s.image.close());
    });
  }
}, Ut = "EXT_mesh_features";
function Pn(s, e, t) {
  s.traverse((n) => {
    if (e.associations.has(n)) {
      let { meshes: a, primitives: i } = e.associations.get(n), r = e.json.meshes[a]?.primitives[i];
      r && r.extensions && r.extensions[Ut] && t(n, r.extensions[Ut]);
    }
  });
}
var go = class {
  constructor(s) {
    this.parser = s, this.name = Ut;
  }
  async afterRoot({ scene: s, parser: e }) {
    let t = e.json.extensionsUsed;
    if (!t || !t.includes(Ut)) return;
    let n = e.json.textures?.length || 0, a = Array(n).fill(null);
    Pn(s, e, (r, { featureIds: l }) => {
      l.forEach((o) => {
        if (o.texture && a[o.texture.index] === null) {
          let c = o.texture.index;
          a[c] = e.loadTexture(c);
        }
      });
    });
    let i = await Promise.all(a);
    Pn(s, e, (r, l) => {
      r.userData.meshFeatures = new bo(r.geometry, i, l);
    });
  }
}, xo = class {
  constructor() {
    this.name = "CESIUM_RTC";
  }
  afterRoot(s) {
    if (s.parser.json.extensions && s.parser.json.extensions.CESIUM_RTC) {
      let { center: e } = s.parser.json.extensions.CESIUM_RTC;
      e && (s.scene.position.x += e[0], s.scene.position.y += e[1], s.scene.position.z += e[2]);
    }
  }
}, yo = class {
  constructor(s) {
    s = {
      metadata: !0,
      rtc: !0,
      plugins: [],
      dracoLoader: null,
      ktxLoader: null,
      meshoptDecoder: null,
      autoDispose: !0,
      ...s
    }, this.tiles = null, this.metadata = s.metadata, this.rtc = s.rtc, this.plugins = s.plugins, this.dracoLoader = s.dracoLoader, this.ktxLoader = s.ktxLoader, this.meshoptDecoder = s.meshoptDecoder, this._gltfRegex = /\.(gltf|glb)$/g, this._dracoRegex = /\.drc$/g, this._loader = null;
  }
  init(s) {
    let e = new Kt(s.manager);
    this.dracoLoader && (e.setDRACOLoader(this.dracoLoader), s.manager.addHandler(this._dracoRegex, this.dracoLoader)), this.ktxLoader && e.setKTX2Loader(this.ktxLoader), this.meshoptDecoder && e.setMeshoptDecoder(this.meshoptDecoder), this.rtc && e.register(() => new xo()), this.metadata && (e.register(() => new po()), e.register(() => new go())), this.plugins.forEach((t) => e.register(t)), s.manager.addHandler(this._gltfRegex, e), this.tiles = s, this._loader = e;
  }
  dispose() {
    this.tiles.manager.removeHandler(this._gltfRegex), this.tiles.manager.removeHandler(this._dracoRegex), this.autoDispose && (this.ktxLoader.dispose(), this.dracoLoader.dispose());
  }
}, { clamp: Il } = Ke;
new Sa(new Ve());
var vo = new Ri(new Uint8Array([
  255,
  255,
  255,
  255
]), 1, 1);
vo.needsUpdate = !0;
var wo = (function() {
  var s = "b9H79Tebbbe8Fv9Gbb9Gvuuuuueu9Giuuub9Geueu9Giuuueuikqbeeedddillviebeoweuec:q:Odkr;leDo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbeY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVbdE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbiL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtblK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949Wbol79IV9Rbrq;w8Wqdbk;esezu8Jjjjjbcj;eb9Rgv8Kjjjjbc9:hodnadcefal0mbcuhoaiRbbc:Ge9hmbavaialfgrad9Radz1jjjbhwcj;abad9Uc;WFbGgocjdaocjd6EhDaicefhocbhqdnindndndnaeaq9nmbaDaeaq9RaqaDfae6Egkcsfglcl4cifcd4hxalc9WGgmTmecbhPawcjdfhsaohzinaraz9Rax6mvarazaxfgo9RcK6mvczhlcbhHinalgic9WfgOawcj;cbffhldndndndndnazaOco4fRbbaHcoG4ciGPlbedibkal9cb83ibalcwf9cb83ibxikalaoRblaoRbbgOco4gAaAciSgAE86bbawcj;cbfaifglcGfaoclfaAfgARbbaOcl4ciGgCaCciSgCE86bbalcVfaAaCfgARbbaOcd4ciGgCaCciSgCE86bbalc7faAaCfgARbbaOciGgOaOciSgOE86bbalctfaAaOfgARbbaoRbegOco4gCaCciSgCE86bbalc91faAaCfgARbbaOcl4ciGgCaCciSgCE86bbalc4faAaCfgARbbaOcd4ciGgCaCciSgCE86bbalc93faAaCfgARbbaOciGgOaOciSgOE86bbalc94faAaOfgARbbaoRbdgOco4gCaCciSgCE86bbalc95faAaCfgARbbaOcl4ciGgCaCciSgCE86bbalc96faAaCfgARbbaOcd4ciGgCaCciSgCE86bbalc97faAaCfgARbbaOciGgOaOciSgOE86bbalc98faAaOfgORbbaoRbigoco4gAaAciSgAE86bbalc99faOaAfgORbbaocl4ciGgAaAciSgAE86bbalc9:faOaAfgORbbaocd4ciGgAaAciSgAE86bbalcufaOaAfglRbbaociGgoaociSgoE86bbalaofhoxdkalaoRbwaoRbbgOcl4gAaAcsSgAE86bbawcj;cbfaifglcGfaocwfaAfgARbbaOcsGgOaOcsSgOE86bbalcVfaAaOfgORbbaoRbegAcl4gCaCcsSgCE86bbalc7faOaCfgORbbaAcsGgAaAcsSgAE86bbalctfaOaAfgORbbaoRbdgAcl4gCaCcsSgCE86bbalc91faOaCfgORbbaAcsGgAaAcsSgAE86bbalc4faOaAfgORbbaoRbigAcl4gCaCcsSgCE86bbalc93faOaCfgORbbaAcsGgAaAcsSgAE86bbalc94faOaAfgORbbaoRblgAcl4gCaCcsSgCE86bbalc95faOaCfgORbbaAcsGgAaAcsSgAE86bbalc96faOaAfgORbbaoRbvgAcl4gCaCcsSgCE86bbalc97faOaCfgORbbaAcsGgAaAcsSgAE86bbalc98faOaAfgORbbaoRbogAcl4gCaCcsSgCE86bbalc99faOaCfgORbbaAcsGgAaAcsSgAE86bbalc9:faOaAfgORbbaoRbrgocl4gAaAcsSgAE86bbalcufaOaAfglRbbaocsGgoaocsSgoE86bbalaofhoxekalao8Pbb83bbalcwfaocwf8Pbb83bbaoczfhokdnaiam9pmbaHcdfhHaiczfhlarao9RcL0mekkaiam6mvaoTmvdnakTmbawaPfRbbhHawcj;cbfhlashiakhOinaialRbbgzce4cbazceG9R7aHfgH86bbaiadfhialcefhlaOcufgOmbkkascefhsaohzaPcefgPad9hmbxikkcbc99arao9Radcaadca0ESEhoxlkaoaxad2fhCdnakmbadhlinaoTmlarao9Rax6mlaoaxfhoalcufglmbkaChoxekcbhmawcjdfhAinarao9Rax6miawamfRbbhHawcj;cbfhlaAhiakhOinaialRbbgzce4cbazceG9R7aHfgH86bbaiadfhialcefhlaOcufgOmbkaAcefhAaoaxfhoamcefgmad9hmbkaChokabaqad2fawcjdfakad2z1jjjb8Aawawcjdfakcufad2fadz1jjjb8Aakaqfhqaombkc9:hoxekc9:hokavcj;ebf8Kjjjjbaok;cseHu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnaeci9UgrcHfal0mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgwce0mbavc;abfcFecjez:jjjjb8AavcUf9cu83ibavc8Wf9cu83ibavcyf9cu83ibavcaf9cu83ibavcKf9cu83ibavczf9cu83ibav9cu83iwav9cu83ibaialfc9WfhDaicefgqarfhidnaeTmbcmcsawceSEhkcbhxcbhmcbhPcbhwcbhlindnaiaD9nmbc9:hoxikdndnaqRbbgoc;Ve0mbavc;abfalaocu7gscl4fcsGcitfgzydlhrazydbhzdnaocsGgHak9pmbavawasfcsGcdtfydbaxaHEhoaHThsdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkaxasfhxcdhHavawcdtfaoBdbawasfhwcehsalhOxdkdndnaHcsSmbaHc987aHamffcefhoxekaicefhoai8SbbgHcFeGhsdndnaHcu9mmbaohixekaicvfhiascFbGhscrhHdninao8SbbgOcFbGaHtasVhsaOcu9kmeaocefhoaHcrfgHc8J9hmbxdkkaocefhikasce4cbasceG9R7amfhokdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkcdhHavawcdtfaoBdbcehsawcefhwalhOaohmxekdnaocpe0mbaxcefgHavawaDaocsGfRbbgocl49RcsGcdtfydbaocz6gzEhravawao9RcsGcdtfydbaHazfgAaocsGgHEhoaHThCdndnadcd9hmbabaPcetfgHax87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHaxBdbaHcwfaoBdbaHclfarBdbkcdhsavawcdtfaxBdbavawcefgwcsGcdtfarBdbcihHavc;abfalcitfgOaxBdlaOarBdbavawazfgwcsGcdtfaoBdbalcefcsGhOawaCfhwaxhzaAaCfhxxekaxcbaiRbbgOEgzaoc;:eSgHfhraOcsGhCaOcl4hAdndnaOcs0mbarcefhoxekarhoavawaA9RcsGcdtfydbhrkdndnaCmbaocefhxxekaohxavawaO9RcsGcdtfydbhokdndnaHTmbaicefhHxekaicdfhHai8SbegscFeGhzdnascu9kmbaicofhXazcFbGhzcrhidninaH8SbbgscFbGaitazVhzascu9kmeaHcefhHaicrfgic8J9hmbkaXhHxekaHcefhHkazce4cbazceG9R7amfgmhzkdndnaAcsSmbaHhsxekaHcefhsaH8SbbgicFeGhrdnaicu9kmbaHcvfhXarcFbGhrcrhidninas8SbbgHcFbGaitarVhraHcu9kmeascefhsaicrfgic8J9hmbkaXhsxekascefhskarce4cbarceG9R7amfgmhrkdndnaCcsSmbashixekascefhias8SbbgocFeGhHdnaocu9kmbascvfhXaHcFbGhHcrhodninai8SbbgscFbGaotaHVhHascu9kmeaicefhiaocrfgoc8J9hmbkaXhixekaicefhikaHce4cbaHceG9R7amfgmhokdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkcdhsavawcdtfazBdbavawcefgwcsGcdtfarBdbcihHavc;abfalcitfgXazBdlaXarBdbavawaOcz6aAcsSVfgwcsGcdtfaoBdbawaCTaCcsSVfhwalcefcsGhOkaqcefhqavc;abfaOcitfgOarBdlaOaoBdbavc;abfalasfcsGcitfgraoBdlarazBdbawcsGhwalaHfcsGhlaPcifgPae6mbkkcbc99aiaDSEhokavc;aef8Kjjjjbaok:flevu8Jjjjjbcz9Rhvc9:hodnaecvfal0mbcuhoaiRbbc;:eGc;qe9hmbav9cb83iwaicefhraialfc98fhwdnaeTmbdnadcdSmbcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcdtfaic8Etc8F91aicd47avcwfaiceGcdtVgoydbfglBdbaoalBdbaDcefgDae9hmbxdkkcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcetfaic8Etc8F91aicd47avcwfaiceGcdtVgoydbfgl87ebaoalBdbaDcefgDae9hmbkkcbc99arawSEhokaok:Lvoeue99dud99eud99dndnadcl9hmbaeTmeindndnabcdfgd8Sbb:Yab8Sbbgi:Ygl:l:tabcefgv8Sbbgo:Ygr:l:tgwJbb;:9cawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai86bbdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad86bbdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad86bbabclfhbaecufgembxdkkaeTmbindndnabclfgd8Ueb:Yab8Uebgi:Ygl:l:tabcdfgv8Uebgo:Ygr:l:tgwJb;:FSawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai87ebdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad87ebdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad87ebabcwfhbaecufgembkkk;oiliui99iue99dnaeTmbcbhiabhlindndnJ;Zl81Zalcof8UebgvciV:Y:vgoal8Ueb:YNgrJb;:FSNJbbbZJbbb:;arJbbbb9GEMgw:lJbbb9p9DTmbaw:OhDxekcjjjj94hDkalclf8Uebhqalcdf8UebhkabaiavcefciGfcetfaD87ebdndnaoak:YNgwJb;:FSNJbbbZJbbb:;awJbbbb9GEMgx:lJbbb9p9DTmbax:OhDxekcjjjj94hDkabaiavciGfgkcd7cetfaD87ebdndnaoaq:YNgoJb;:FSNJbbbZJbbb:;aoJbbbb9GEMgx:lJbbb9p9DTmbax:OhDxekcjjjj94hDkabaiavcufciGfcetfaD87ebdndnJbbjZararN:tawawN:taoaoN:tgrJbbbbarJbbbb9GE:rJb;:FSNJbbbZMgr:lJbbb9p9DTmbar:Ohvxekcjjjj94hvkabakcetfav87ebalcwfhlaiclfhiaecufgembkkk9mbdnadcd4ae2gdTmbinababydbgecwtcw91:Yaece91cjjj98Gcjjj;8if::NUdbabclfhbadcufgdmbkkk9teiucbcbydj1jjbgeabcifc98GfgbBdj1jjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaik;LeeeudndnaeabVciGTmbabhixekdndnadcz9pmbabhixekabhiinaiaeydbBdbaiclfaeclfydbBdbaicwfaecwfydbBdbaicxfaecxfydbBdbaeczfheaiczfhiadc9Wfgdcs0mbkkadcl6mbinaiaeydbBdbaeclfheaiclfhiadc98fgdci0mbkkdnadTmbinaiaeRbb86bbaicefhiaecefheadcufgdmbkkabk;aeedudndnabciGTmbabhixekaecFeGc:b:c:ew2hldndnadcz9pmbabhixekabhiinaialBdbaicxfalBdbaicwfalBdbaiclfalBdbaiczfhiadc9Wfgdcs0mbkkadcl6mbinaialBdbaiclfhiadc98fgdci0mbkkdnadTmbinaiae86bbaicefhiadcufgdmbkkabkkkebcjwklzNbb", e = "b9H79TebbbeKl9Gbb9Gvuuuuueu9Giuuub9Geueuikqbbebeedddilve9Weeeviebeoweuec:q:6dkr;leDo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbdY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVblE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtboK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbrL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949Wbwl79IV9RbDq:p9sqlbzik9:evu8Jjjjjbcz9Rhbcbheincbhdcbhiinabcwfadfaicjuaead4ceGglE86bbaialfhiadcefgdcw9hmbkaec:q:yjjbfai86bbaecitc:q1jjbfab8Piw83ibaecefgecjd9hmbkk:N8JlHud97euo978Jjjjjbcj;kb9Rgv8Kjjjjbc9:hodnadcefal0mbcuhoaiRbbc:Ge9hmbavaialfgrad9Rad;8qbbcj;abad9UhlaicefhodnaeTmbadTmbalc;WFbGglcjdalcjd6EhwcbhDinawaeaD9RaDawfae6Egqcsfglc9WGgkci2hxakcethmalcl4cifcd4hPabaDad2fhsakc;ab6hzcbhHincbhOaohAdndninaraA9RaP6meavcj;cbfaOak2fhCaAaPfhocbhidnazmbarao9Rc;Gb6mbcbhlinaCalfhidndndndndnaAalco4fRbbgXciGPlbedibkaipxbbbbbbbbbbbbbbbbpklbxikaiaopbblaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbaoclfaYpQbfaKc:q:yjjbfRbbfhoxdkaiaopbbwaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbaocwfaYpQbfaKc:q:yjjbfRbbfhoxekaiaopbbbpklbaoczfhokdndndndndnaXcd4ciGPlbedibkaipxbbbbbbbbbbbbbbbbpklzxikaiaopbblaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklzaoclfaYpQbfaKc:q:yjjbfRbbfhoxdkaiaopbbwaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklzaocwfaYpQbfaKc:q:yjjbfRbbfhoxekaiaopbbbpklzaoczfhokdndndndndnaXcl4ciGPlbedibkaipxbbbbbbbbbbbbbbbbpklaxikaiaopbblaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklaaoclfaYpQbfaKc:q:yjjbfRbbfhoxdkaiaopbbwaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklaaocwfaYpQbfaKc:q:yjjbfRbbfhoxekaiaopbbbpklaaoczfhokdndndndndnaXco4Plbedibkaipxbbbbbbbbbbbbbbbbpkl8WxikaiaopbblaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibaXc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkl8WaoclfaYpQbfaXc:q:yjjbfRbbfhoxdkaiaopbbwaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibaXc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkl8WaocwfaYpQbfaXc:q:yjjbfRbbfhoxekaiaopbbbpkl8Waoczfhokalc;abfhialcjefak0meaihlarao9Rc;Fb0mbkkdnaiak9pmbaici4hlinarao9RcK6miaCaifhXdndndndndnaAaico4fRbbalcoG4ciGPlbedibkaXpxbbbbbbbbbbbbbbbbpkbbxikaXaopbblaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkbbaoclfaYpQbfaKc:q:yjjbfRbbfhoxdkaXaopbbwaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkbbaocwfaYpQbfaKc:q:yjjbfRbbfhoxekaXaopbbbpkbbaoczfhokalcdfhlaiczfgiak6mbkkaoTmeaohAaOcefgOclSmdxbkkc9:hoxlkdnakTmbavcjdfaHfhiavaHfpbdbhYcbhXinaiavcj;cbfaXfglpblbgLcep9TaLpxeeeeeeeeeeeeeeeegQp9op9Hp9rgLalakfpblbg8Acep9Ta8AaQp9op9Hp9rg8ApmbzeHdOiAlCvXoQrLgEalamfpblbg3cep9Ta3aQp9op9Hp9rg3alaxfpblbg5cep9Ta5aQp9op9Hp9rg5pmbzeHdOiAlCvXoQrLg8EpmbezHdiOAlvCXorQLgQaQpmbedibedibedibediaYp9UgYp9AdbbaiadfglaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaladfglaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaladfglaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaladfglaYaEa8EpmwDKYqk8AExm35Ps8E8FgQaQpmbedibedibedibedip9UgYp9AdbbaladfglaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaladfglaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaladfglaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaladfglaYaLa8ApmwKDYq8AkEx3m5P8Es8FgLa3a5pmwKDYq8AkEx3m5P8Es8Fg8ApmbezHdiOAlvCXorQLgQaQpmbedibedibedibedip9UgYp9AdbbaladfglaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaladfglaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaladfglaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaladfglaYaLa8ApmwDKYqk8AExm35Ps8E8FgQaQpmbedibedibedibedip9UgYp9AdbbaladfglaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaladfglaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaladfglaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaladfhiaXczfgXak6mbkkaHclfgHad6mbkasavcjdfaqad2;8qbbavavcjdfaqcufad2fad;8qbbaqaDfgDae6mbkkcbc99arao9Radcaadca0ESEhokavcj;kbf8Kjjjjbaokwbz:bjjjbk::seHu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnaeci9UgrcHfal0mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgwce0mbavc;abfcFecje;8kbavcUf9cu83ibavc8Wf9cu83ibavcyf9cu83ibavcaf9cu83ibavcKf9cu83ibavczf9cu83ibav9cu83iwav9cu83ibaialfc9WfhDaicefgqarfhidnaeTmbcmcsawceSEhkcbhxcbhmcbhPcbhwcbhlindnaiaD9nmbc9:hoxikdndnaqRbbgoc;Ve0mbavc;abfalaocu7gscl4fcsGcitfgzydlhrazydbhzdnaocsGgHak9pmbavawasfcsGcdtfydbaxaHEhoaHThsdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkaxasfhxcdhHavawcdtfaoBdbawasfhwcehsalhOxdkdndnaHcsSmbaHc987aHamffcefhoxekaicefhoai8SbbgHcFeGhsdndnaHcu9mmbaohixekaicvfhiascFbGhscrhHdninao8SbbgOcFbGaHtasVhsaOcu9kmeaocefhoaHcrfgHc8J9hmbxdkkaocefhikasce4cbasceG9R7amfhokdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkcdhHavawcdtfaoBdbcehsawcefhwalhOaohmxekdnaocpe0mbaxcefgHavawaDaocsGfRbbgocl49RcsGcdtfydbaocz6gzEhravawao9RcsGcdtfydbaHazfgAaocsGgHEhoaHThCdndnadcd9hmbabaPcetfgHax87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHaxBdbaHcwfaoBdbaHclfarBdbkcdhsavawcdtfaxBdbavawcefgwcsGcdtfarBdbcihHavc;abfalcitfgOaxBdlaOarBdbavawazfgwcsGcdtfaoBdbalcefcsGhOawaCfhwaxhzaAaCfhxxekaxcbaiRbbgOEgzaoc;:eSgHfhraOcsGhCaOcl4hAdndnaOcs0mbarcefhoxekarhoavawaA9RcsGcdtfydbhrkdndnaCmbaocefhxxekaohxavawaO9RcsGcdtfydbhokdndnaHTmbaicefhHxekaicdfhHai8SbegscFeGhzdnascu9kmbaicofhXazcFbGhzcrhidninaH8SbbgscFbGaitazVhzascu9kmeaHcefhHaicrfgic8J9hmbkaXhHxekaHcefhHkazce4cbazceG9R7amfgmhzkdndnaAcsSmbaHhsxekaHcefhsaH8SbbgicFeGhrdnaicu9kmbaHcvfhXarcFbGhrcrhidninas8SbbgHcFbGaitarVhraHcu9kmeascefhsaicrfgic8J9hmbkaXhsxekascefhskarce4cbarceG9R7amfgmhrkdndnaCcsSmbashixekascefhias8SbbgocFeGhHdnaocu9kmbascvfhXaHcFbGhHcrhodninai8SbbgscFbGaotaHVhHascu9kmeaicefhiaocrfgoc8J9hmbkaXhixekaicefhikaHce4cbaHceG9R7amfgmhokdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkcdhsavawcdtfazBdbavawcefgwcsGcdtfarBdbcihHavc;abfalcitfgXazBdlaXarBdbavawaOcz6aAcsSVfgwcsGcdtfaoBdbawaCTaCcsSVfhwalcefcsGhOkaqcefhqavc;abfaOcitfgOarBdlaOaoBdbavc;abfalasfcsGcitfgraoBdlarazBdbawcsGhwalaHfcsGhlaPcifgPae6mbkkcbc99aiaDSEhokavc;aef8Kjjjjbaok:flevu8Jjjjjbcz9Rhvc9:hodnaecvfal0mbcuhoaiRbbc;:eGc;qe9hmbav9cb83iwaicefhraialfc98fhwdnaeTmbdnadcdSmbcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcdtfaic8Etc8F91aicd47avcwfaiceGcdtVgoydbfglBdbaoalBdbaDcefgDae9hmbxdkkcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcetfaic8Etc8F91aicd47avcwfaiceGcdtVgoydbfgl87ebaoalBdbaDcefgDae9hmbkkcbc99arawSEhokaok:wPliuo97eue978Jjjjjbca9Rhiaec98Ghldndnadcl9hmbdnalTmbcbhvabhdinadadpbbbgocKp:RecKp:Sep;6egraocwp:RecKp:Sep;6earp;Geaoczp:RecKp:Sep;6egwp;Gep;Kep;LegDpxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgkp9op9rp;Kegrpxbb;:9cbb;:9cbb;:9cbb;:9cararp;MeaDaDp;Meawaqawakp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFbbbFbbbFbbbFbbbp9oaopxbbbFbbbFbbbFbbbFp9op9qarawp;Meaqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaDawp;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpkbbadczfhdavclfgval6mbkkalaeSmeaipxbbbbbbbbbbbbbbbbgqpklbaiabalcdtfgdaeciGglcdtgv;8qbbdnalTmbaiaipblbgocKp:RecKp:Sep;6egraocwp:RecKp:Sep;6earp;Geaoczp:RecKp:Sep;6egwp;Gep;Kep;LegDaqp:2egqarpxbbbjbbbjbbbjbbbjgkp9op9rp;Kegrpxbb;:9cbb;:9cbb;:9cbb;:9cararp;MeaDaDp;Meawaqawakp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFbbbFbbbFbbbFbbbp9oaopxbbbFbbbFbbbFbbbFp9op9qarawp;Meaqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaDawp;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpklbkadaiav;8qbbskdnalTmbcbhvabhdinadczfgxaxpbbbgopxbbbbbbFFbbbbbbFFgkp9oadpbbbgDaopmbediwDqkzHOAKY8AEgwczp:Reczp:Sep;6egraDaopmlvorxmPsCXQL358E8FpxFubbFubbFubbFubbp9op;6eawczp:Sep;6egwp;Gearp;Gep;Kep;Legopxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgmp9op9rp;Kegrpxb;:FSb;:FSb;:FSb;:FSararp;Meaoaop;Meawaqawamp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFFbbFFbbFFbbFFbbp9oaoawp;Meaqp;Keczp:Rep9qgoarawp;Meaqp;KepxFFbbFFbbFFbbFFbbp9ogrpmwDKYqk8AExm35Ps8E8Fp9qpkbbadaDakp9oaoarpmbezHdiOAlvCXorQLp9qpkbbadcafhdavclfgval6mbkkalaeSmbaiaeciGgvcitgdfcbcaad9R;8kbaiabalcitfglad;8qbbdnavTmbaiaipblzgopxbbbbbbFFbbbbbbFFgkp9oaipblbgDaopmbediwDqkzHOAKY8AEgwczp:Reczp:Sep;6egraDaopmlvorxmPsCXQL358E8FpxFubbFubbFubbFubbp9op;6eawczp:Sep;6egwp;Gearp;Gep;Kep;Legopxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgmp9op9rp;Kegrpxb;:FSb;:FSb;:FSb;:FSararp;Meaoaop;Meawaqawamp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFFbbFFbbFFbbFFbbp9oaoawp;Meaqp;Keczp:Rep9qgoarawp;Meaqp;KepxFFbbFFbbFFbbFFbbp9ogrpmwDKYqk8AExm35Ps8E8Fp9qpklzaiaDakp9oaoarpmbezHdiOAlvCXorQLp9qpklbkalaiad;8qbbkk;4wllue97euv978Jjjjjbc8W9Rhidnaec98GglTmbcbhvabhoinaiaopbbbgraoczfgwpbbbgDpmlvorxmPsCXQL358E8Fgqczp:Segkclp:RepklbaopxbbjZbbjZbbjZbbjZpx;Zl81Z;Zl81Z;Zl81Z;Zl81Zakpxibbbibbbibbbibbbp9qp;6ep;NegkaraDpmbediwDqkzHOAKY8AEgrczp:Reczp:Sep;6ep;MegDaDp;Meakarczp:Sep;6ep;Megxaxp;Meakaqczp:Reczp:Sep;6ep;Megqaqp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jepxb;:FSb;:FSb;:FSb;:FSgkp;Mepxbbn0bbn0bbn0bbn0grp;KepxFFbbFFbbFFbbFFbbgmp9oaxakp;Mearp;Keczp:Rep9qgxaDakp;Mearp;Keamp9oaqakp;Mearp;Keczp:Rep9qgkpmbezHdiOAlvCXorQLgrp5baipblbpEb:T:j83ibaocwfarp5eaipblbpEe:T:j83ibawaxakpmwDKYqk8AExm35Ps8E8Fgkp5baipblbpEd:T:j83ibaocKfakp5eaipblbpEi:T:j83ibaocafhoavclfgval6mbkkdnalaeSmbaiaeciGgvcitgofcbcaao9R;8kbaiabalcitfgwao;8qbbdnavTmbaiaipblbgraipblzgDpmlvorxmPsCXQL358E8Fgqczp:Segkclp:RepklaaipxbbjZbbjZbbjZbbjZpx;Zl81Z;Zl81Z;Zl81Z;Zl81Zakpxibbbibbbibbbibbbp9qp;6ep;NegkaraDpmbediwDqkzHOAKY8AEgrczp:Reczp:Sep;6ep;MegDaDp;Meakarczp:Sep;6ep;Megxaxp;Meakaqczp:Reczp:Sep;6ep;Megqaqp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jepxb;:FSb;:FSb;:FSb;:FSgkp;Mepxbbn0bbn0bbn0bbn0grp;KepxFFbbFFbbFFbbFFbbgmp9oaxakp;Mearp;Keczp:Rep9qgxaDakp;Mearp;Keamp9oaqakp;Mearp;Keczp:Rep9qgkpmbezHdiOAlvCXorQLgrp5baipblapEb:T:j83ibaiarp5eaipblapEe:T:j83iwaiaxakpmwDKYqk8AExm35Ps8E8Fgkp5baipblapEd:T:j83izaiakp5eaipblapEi:T:j83iKkawaiao;8qbbkk:Pddiue978Jjjjjbc;ab9Rhidnadcd4ae2glc98GgvTmbcbheabhdinadadpbbbgocwp:Recwp:Sep;6eaocep:SepxbbjFbbjFbbjFbbjFp9opxbbjZbbjZbbjZbbjZp:Uep;Mepkbbadczfhdaeclfgeav6mbkkdnavalSmbaialciGgecdtgdVcbc;abad9R;8kbaiabavcdtfgvad;8qbbdnaeTmbaiaipblbgocwp:Recwp:Sep;6eaocep:SepxbbjFbbjFbbjFbbjFp9opxbbjZbbjZbbjZbbjZp:Uep;Mepklbkavaiad;8qbbkk9teiucbcbydj1jjbgeabcifc98GfgbBdj1jjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaikkkebcjwklz:Dbb", t = new Uint8Array([
    0,
    97,
    115,
    109,
    1,
    0,
    0,
    0,
    1,
    4,
    1,
    96,
    0,
    0,
    3,
    3,
    2,
    0,
    0,
    5,
    3,
    1,
    0,
    1,
    12,
    1,
    0,
    10,
    22,
    2,
    12,
    0,
    65,
    0,
    65,
    0,
    65,
    0,
    252,
    10,
    0,
    0,
    11,
    7,
    0,
    65,
    0,
    253,
    15,
    26,
    11
  ]), n = new Uint8Array([
    32,
    0,
    65,
    2,
    1,
    106,
    34,
    33,
    3,
    128,
    11,
    4,
    13,
    64,
    6,
    253,
    10,
    7,
    15,
    116,
    127,
    5,
    8,
    12,
    40,
    16,
    19,
    54,
    20,
    9,
    27,
    255,
    113,
    17,
    42,
    67,
    24,
    23,
    146,
    148,
    18,
    14,
    22,
    45,
    70,
    69,
    56,
    114,
    101,
    21,
    25,
    63,
    75,
    136,
    108,
    28,
    118,
    29,
    73,
    115
  ]);
  if (typeof WebAssembly != "object")
    return {
      supported: !1
    };
  var a = WebAssembly.validate(t) ? l(e) : l(s), i, r = WebAssembly.instantiate(a, {}).then(function(b) {
    i = b.instance, i.exports.__wasm_call_ctors();
  });
  function l(b) {
    for (var x = new Uint8Array(b.length), m = 0; m < b.length; ++m) {
      var v = b.charCodeAt(m);
      x[m] = v > 96 ? v - 97 : v > 64 ? v - 39 : v + 4;
    }
    for (var w = 0, m = 0; m < b.length; ++m)
      x[w++] = x[m] < 60 ? n[x[m]] : (x[m] - 60) * 64 + x[++m];
    return x.buffer.slice(0, w);
  }
  function o(b, x, m, v, w, T, M) {
    var S = b.exports.sbrk, R = v + 3 & -4, E = S(R * w), O = S(T.length), I = new Uint8Array(b.exports.memory.buffer);
    I.set(T, O);
    var A = x(E, v, w, O, T.length);
    if (A == 0 && M && M(E, R, w), m.set(I.subarray(E, E + v * w)), S(E - S(0)), A != 0)
      throw new Error("Malformed buffer data: " + A);
  }
  var c = {
    NONE: "",
    OCTAHEDRAL: "meshopt_decodeFilterOct",
    QUATERNION: "meshopt_decodeFilterQuat",
    EXPONENTIAL: "meshopt_decodeFilterExp"
  }, d = {
    ATTRIBUTES: "meshopt_decodeVertexBuffer",
    TRIANGLES: "meshopt_decodeIndexBuffer",
    INDICES: "meshopt_decodeIndexSequence"
  }, u = [], h = 0;
  function f(b) {
    var x = {
      object: new Worker(b),
      pending: 0,
      requests: {}
    };
    return x.object.onmessage = function(m) {
      var v = m.data;
      x.pending -= v.count, x.requests[v.id][v.action](v.value), delete x.requests[v.id];
    }, x;
  }
  function p(b) {
    for (var x = "self.ready = WebAssembly.instantiate(new Uint8Array([" + new Uint8Array(a) + "]), {}).then(function(result) { result.instance.exports.__wasm_call_ctors(); return result.instance; });self.onmessage = " + g.name + ";" + o.toString() + g.toString(), m = new Blob([x], { type: "text/javascript" }), v = URL.createObjectURL(m), w = u.length; w < b; ++w)
      u[w] = f(v);
    for (var w = b; w < u.length; ++w)
      u[w].object.postMessage({});
    u.length = b, URL.revokeObjectURL(v);
  }
  function y(b, x, m, v, w) {
    for (var T = u[0], M = 1; M < u.length; ++M)
      u[M].pending < T.pending && (T = u[M]);
    return new Promise(function(S, R) {
      var E = new Uint8Array(m), O = ++h;
      T.pending += b, T.requests[O] = { resolve: S, reject: R }, T.object.postMessage({ id: O, count: b, size: x, source: E, mode: v, filter: w }, [E.buffer]);
    });
  }
  function g(b) {
    var x = b.data;
    if (!x.id)
      return self.close();
    self.ready.then(function(m) {
      try {
        var v = new Uint8Array(x.count * x.size);
        o(m, m.exports[x.mode], v, x.count, x.size, x.source, m.exports[x.filter]), self.postMessage({ id: x.id, count: x.count, action: "resolve", value: v }, [v.buffer]);
      } catch (w) {
        self.postMessage({ id: x.id, count: x.count, action: "reject", value: w });
      }
    });
  }
  return {
    ready: r,
    supported: !0,
    useWorkers: function(b) {
      p(b);
    },
    decodeVertexBuffer: function(b, x, m, v, w) {
      o(i, i.exports.meshopt_decodeVertexBuffer, b, x, m, v, i.exports[c[w]]);
    },
    decodeIndexBuffer: function(b, x, m, v) {
      o(i, i.exports.meshopt_decodeIndexBuffer, b, x, m, v);
    },
    decodeIndexSequence: function(b, x, m, v) {
      o(i, i.exports.meshopt_decodeIndexSequence, b, x, m, v);
    },
    decodeGltfBuffer: function(b, x, m, v, w, T) {
      o(i, i.exports[d[w]], b, x, m, v, i.exports[c[T]]);
    },
    decodeGltfBufferAsync: function(b, x, m, v, w) {
      return u.length > 0 ? y(b, x, m, d[v], c[w]) : r.then(function() {
        var T = new Uint8Array(b * x);
        return o(i, i.exports[d[v]], T, b, x, m, i.exports[c[w]]), T;
      });
    }
  };
})();
function To(s, e) {
  if (s === 5123) return new Uint16Array(e);
  if (s === 5125) return new Uint32Array(e);
  throw new Error(`Unsupported index component ${s}`);
}
class Ao {
  constructor() {
    this.worker = new Worker(new URL(
      /* @vite-ignore */
      "" + new URL("assets/coarse-glb-worker-Cs_2svsI.js", import.meta.url).href,
      import.meta.url
    ), { type: "module" }), this.nextId = 1, this.pending = /* @__PURE__ */ new Map(), this.worker.onmessage = (e) => {
      const { id: t, error: n, ...a } = e.data, i = this.pending.get(t);
      if (i)
        if (this.pending.delete(t), n) i.reject(new Error(n));
        else
          try {
            i.resolve(this.build(a));
          } catch (r) {
            i.reject(r);
          }
    }, this.worker.onerror = (e) => {
      for (const t of this.pending.values()) t.reject(e);
      this.pending.clear();
    };
  }
  setWithCredentials() {
    return this;
  }
  setRequestHeader() {
    return this;
  }
  setCrossOrigin() {
    return this;
  }
  parseAsync(e) {
    const t = this.nextId++;
    return new Promise((n, a) => {
      this.pending.set(t, { resolve: n, reject: a }), this.worker.postMessage({ id: t, buffer: e }, [e]);
    });
  }
  async loadAsync(e) {
    const t = await fetch(e);
    if (!t.ok) throw new Error(`${e}: HTTP ${t.status}`);
    return this.parseAsync(await t.arrayBuffer());
  }
  build(e) {
    const t = new K.BufferGeometry();
    t.setAttribute("position", new K.BufferAttribute(new Float32Array(e.position.buffer), 3)), t.setAttribute("uv", new K.BufferAttribute(new Float32Array(e.uv.buffer), 2)), e.normal && t.setAttribute("normal", new K.BufferAttribute(new Float32Array(e.normal.buffer), 3)), t.setIndex(new K.BufferAttribute(To(e.indices.componentType, e.indices.buffer), 1)), t.boundingBox = new K.Box3(new K.Vector3(...e.position.min), new K.Vector3(...e.position.max)), t.boundingSphere = new K.Sphere(new K.Vector3(...e.sphere.center), e.sphere.radius);
    const n = new K.Texture(e.image);
    n.colorSpace = K.SRGBColorSpace, n.flipY = !1, n.generateMipmaps = !1, n.minFilter = K.LinearFilter, n.magFilter = K.LinearFilter, n.wrapS = n.wrapT = K.ClampToEdgeWrapping, n.needsUpdate = !0;
    const a = new K.MeshBasicMaterial({ map: n, side: K.DoubleSide }), i = new K.Mesh(t, a);
    i.position.fromArray(e.translation);
    const r = new K.Group();
    return r.add(i), { scene: r, scenes: [r], animations: [], cameras: [], asset: { version: "2.0", generator: "map-skae coarse worker loader" } };
  }
  dispose() {
    this.worker.terminate();
    for (const e of this.pending.values()) e.reject(new Error("Apple R3D worker loader disposed"));
    this.pending.clear();
  }
}
class Mo {
  constructor() {
    this.name = "APPLE_R3D_WORKER_GLTF_LOADER", this.loader = new Ao(), this.tiles = null, this.regex = /\.(gltf|glb)$/g;
  }
  init(e) {
    this.tiles = e, e.manager.addHandler(this.regex, this.loader);
  }
  dispose() {
    this.tiles?.manager.removeHandler(this.regex), this.loader.dispose();
  }
}
const zn = "apple-r3d-converted-preview-v4-complete-shore-cell", Dl = !1, it = "__appleR3DWorldOwner", So = /* @__PURE__ */ new Set([
  "apple-r3d-layered-ownership/v1",
  "apple-r3d-combined-regional-ownership/v1"
]);
function Ro(s) {
  return So.has(s);
}
function readPackedOwnershipChild(s, e) {
  const t = e * 10, n = t >>> 3, a = t & 7;
  return ((s[n] ?? 0) | (s[n + 1] ?? 0) << 8 | (s[n + 2] ?? 0) << 16) >>> a & 1023;
}
function binaryExpectedChildId(s, e) {
  const t = readPackedOwnershipChild(s.bytes, s.offset + e), n = t & 63;
  if (n >= s.side * s.side) throw new Error(`ownership binary: invalid child in ${s.parentId}`);
  return `${s.childZoom}/${s.parentX * s.side + Math.floor(n / s.side)}/${s.parentY * s.side + n % s.side}/${t >>> 6}`;
}
const binaryExpectedPrototype = {
  get length() {
    return this.count;
  },
  *[Symbol.iterator]() {
    for (let s = 0; s < this.count; s++) yield binaryExpectedChildId(this, s);
  },
  at(s) {
    const e = s < 0 ? this.count + s : s;
    return e >= 0 && e < this.count ? binaryExpectedChildId(this, e) : void 0;
  },
  map(s, e) {
    const t = new Array(this.count);
    for (let n = 0; n < this.count; n++) t[n] = s.call(e, binaryExpectedChildId(this, n), n, this);
    return t;
  },
  every(s, e) {
    for (let t = 0; t < this.count; t++) if (!s.call(e, binaryExpectedChildId(this, t), t, this)) return !1;
    return !0;
  },
  some(s, e) {
    for (let t = 0; t < this.count; t++) if (s.call(e, binaryExpectedChildId(this, t), t, this)) return !0;
    return !1;
  },
  filter(s, e) {
    const t = [];
    for (let n = 0; n < this.count; n++) {
      const a = binaryExpectedChildId(this, n);
      s.call(e, a, n, this) && t.push(a);
    }
    return t;
  },
  includes(s, e = 0) {
    let t = Math.max(0, e < 0 ? this.count + e : e);
    if (typeof s !== "string") return !1;
    const n = s.split("/").map(Number), a = n[1] - this.parentX * this.side, i = n[2] - this.parentY * this.side, r = (n[3] ?? 0) * 64 + a * this.side + i;
    if (n.length !== 4 || n[0] !== this.childZoom || !Number.isInteger(r) || a < 0 || a >= this.side || i < 0 || i >= this.side || (n[3] ?? 0) < 0 || (n[3] ?? 0) > 15) return !1;
    for (; t < this.count; t++) if (readPackedOwnershipChild(this.bytes, this.offset + t) === r) return binaryExpectedChildId(this, t) === s;
    return !1;
  },
  forEach(s, e) {
    for (let t = 0; t < this.count; t++) s.call(e, binaryExpectedChildId(this, t), t, this);
  }
};
function parseOwnershipBinary(s) {
  const e = s instanceof ArrayBuffer ? s : s.buffer.slice(s.byteOffset, s.byteOffset + s.byteLength), t = new DataView(e), n = new Uint8Array(e);
  if (e.byteLength < 24) throw new Error("ownership binary: truncated header");
  const a = "R3DOWN01";
  for (let E = 0; E < a.length; E++)
    if (n[E] !== a.charCodeAt(E)) throw new Error("ownership binary: invalid magic");
  const i = t.getUint8(8), r = t.getUint8(9), l = t.getUint16(10, !0), o = t.getUint32(12, !0), c = t.getUint32(16, !0), d = t.getUint32(20, !0), u = r === 1 ? "apple-r3d-layered-ownership/v1" : r === 2 ? "apple-r3d-combined-regional-ownership/v1" : null;
  if (i !== 1 || l !== 20 || d !== 24 || !u) throw new Error("ownership binary: unsupported format");
  const h = d + o * l;
  if (!Number.isSafeInteger(h) || h + Math.ceil(c * 10 / 8) !== e.byteLength) throw new Error("ownership binary: invalid lengths");
  const f = n.subarray(h), p = /* @__PURE__ */ Object.create(null);
  for (let E = 0; E < o; E++) {
    const O = d + E * l, I = t.getUint8(O), D = t.getUint8(O + 1), P = t.getUint8(O + 2), z = t.getUint32(O + 4, !0), _ = t.getUint32(O + 8, !0), L = t.getUint32(O + 12, !0), N = t.getUint16(O + 16, !0), B = D - I;
    if (B < 1 || B > 3 || P > 1 || L + N > c || N > 1024) throw new Error(`ownership binary: invalid record ${E}`);
    const U = `${I}/${z}/${_}/0`;
    if (Object.hasOwn(p, U)) throw new Error(`ownership binary: duplicate transition ${U}`);
    p[U] = E;
  }
  const g = new Proxy(p, {
    get(E, O, I) {
      const D = Reflect.get(E, O, I);
      if (typeof D !== "number" || typeof O !== "string") return D;
      const P = d + D * l, z = t.getUint8(P), _ = t.getUint8(P + 1), L = t.getUint8(P + 2) === 1, N = t.getUint32(P + 4, !0), B = t.getUint32(P + 8, !0), j = t.getUint32(P + 12, !0), U = t.getUint16(P + 16, !0), H = 1 << (_ - z), G = Object.assign(Object.create(binaryExpectedPrototype), { bytes: f, offset: j, count: U, childZoom: _, parentX: N, parentY: B, side: H, parentId: O }), V = { childZoom: _, complete: L, expected: G };
      return Reflect.set(E, O, V, I), V;
    }
  });
  return { schema: u, transitions: g };
}
const _n = [15, 16, 17, 20], Eo = { 15: 1e3 / 60, 16: 1e3 / 30, 17: 1e3 / 20, 20: 1e3 / 15 }, Ln = {
  15: "/apple-r3d-city-layered-cache/z15.json",
  16: "/apple-r3d-city-layered-cache/z16.json",
  17: "/apple-r3d-city-layered-cache/z17.json",
  20: "/apple-r3d-city-layered-cache/z20.json",
  ownership: "/apple-r3d-city-layered-cache/ownership-runtime.json"
}, Ss = 167671, Rs = 405291, pt = 30.1195, mt = 30.2463, Nn = 256, kt = 64, Bn = 8, cs = 3, us = 72, ds = 112, Co = 96, Fo = 470, ko = 240, Oo = 900, hs = 180, Io = 20, Do = 720, fs = 18, Po = 560, zo = 650, jn = 2400, _o = 430, Lo = 36, Ot = 128, No = 8, Bo = { 15: 16, 16: 24, 17: 32 }, jo = 3e4, Uo = { 15: 3200, 16: 2200, 17: 1400 }, Ho = 1, Go = 2e4, Vo = 8e3, Xo = 700, Es = 420, qo = 650, Zo = 2e4, Oa = 140, Ia = 190, Da = Es, Un = 1e4, ps = 3, Hn = 3, Gn = 2, Vn = 35e7, Xn = 65e7, Wo = 22e8, Ko = 29e8, Yo = 4600, Qo = 39e8, Jo = 52e8, $o = 7600, Pa = 16, el = 64, tl = 64, sl = 2, nl = 12, al = 96, ct = 64, ut = 0.12, rt = "primitive-index-triplet-direct-v1";
function il(s, e, t) {
  const n = /* @__PURE__ */ new Map(), a = {
    9728: e.NearestFilter,
    9729: e.LinearFilter,
    9984: e.NearestMipmapNearestFilter,
    9985: e.LinearMipmapNearestFilter,
    9986: e.NearestMipmapLinearFilter,
    9987: e.LinearMipmapLinearFilter
  }, i = {
    33071: e.ClampToEdgeWrapping,
    33648: e.MirroredRepeatWrapping,
    10497: e.RepeatWrapping
  };
  return {
    name: "APPLE_r3d_embedded_image_bitmap",
    loadTexture(r) {
      if (typeof globalThis.createImageBitmap != "function") return null;
      const l = s.json.textures?.[r], o = l?.source, c = s.json.images?.[o];
      if (c?.bufferView == null) return null;
      if (s.json.asset?.extras?.exactMeshopt?.images?.[o]?.sha256 === "2a97952fe7da119bbb00349781e8f0f2af2941693458c5976135bffe61431ca5")
        return s.getDependency("bufferView", c.bufferView).then((f) => {
          const p = f instanceof Uint8Array ? f : new Uint8Array(f), y = new e.DataTexture(new Uint8Array([0, 0, 0, 0]), 1, 1);
          const g = p.slice();
          return y.flipY = !1, y.userData.mimeType = c.mimeType ?? "image/jpeg", y.userData.splatTransportAnchor = !0, t.trackSourceTextureBytes?.(y, g), y.needsUpdate = !0, s.associations?.set(y, { textures: r }), t.transportAnchors = (t.transportAnchors ?? 0) + 1, y;
        });
      const u = `${c.bufferView}:${l.sampler ?? -1}`;
      if (n.has(u)) return n.get(u);
      const h = s.getDependency("bufferView", c.bufferView).then(async (f) => {
        const y = (f instanceof Uint8Array ? f : new Uint8Array(f)).slice(), g = new Blob([y], { type: c.mimeType ?? "image/jpeg" });
        let b = null, x = null;
        for (let w = 1; w <= Gn; w++)
          try {
            b = await globalThis.createImageBitmap(g, {
              imageOrientation: "none",
              premultiplyAlpha: "none",
              colorSpaceConversion: "none"
            }), w > 1 && t.retries++;
            break;
          } catch (T) {
            x = T, w < Gn && (t.retries++, await new Promise((M) => setTimeout(M, 40 * w)));
          }
        if (!b)
          throw t.failures++, x ?? new Error("Embedded Apple JPEG decode failed");
        const m = new e.Texture(b);
        m.flipY = !1, m.name = l.name || c.name || "";
        const v = s.json.samplers?.[l.sampler] ?? {};
        return m.magFilter = a[v.magFilter] || e.LinearFilter, m.minFilter = a[v.minFilter] || e.LinearMipmapLinearFilter, m.wrapS = i[v.wrapS] || e.RepeatWrapping, m.wrapT = i[v.wrapT] || e.RepeatWrapping, m.generateMipmaps = m.minFilter !== e.NearestFilter && m.minFilter !== e.LinearFilter, m.userData.mimeType = c.mimeType ?? "image/jpeg", t.trackSourceTextureBytes?.(m, y), m.needsUpdate = !0, s.associations?.set(m, { textures: r }), t.decodes++, m;
      });
      return n.set(u, h), h;
    }
  };
}
function rl(s) {
  if (!s) return !1;
  const e = s.source?.data ?? s.image;
  if (!e) return !1;
  if (e.isDataTexture || e.data) return !0;
  const t = Number(e.naturalWidth ?? e.videoWidth ?? e.width), n = Number(e.naturalHeight ?? e.videoHeight ?? e.height);
  return Number.isFinite(t) && Number.isFinite(n) && t > 0 && n > 0;
}
function ol(s) {
  const { zoom: e, x: t, y: n } = oe(s), a = 2 ** (20 - e);
  return {
    minX: (Rs - (n + 1) * a + 0.5) * pt,
    maxX: (Rs - n * a + 0.5) * pt,
    minZ: (t * a - Ss - 0.5) * mt,
    maxZ: ((t + 1) * a - Ss - 0.5) * mt
  };
}
function ll(s, e = ut) {
  return {
    minX: s.minX - e,
    maxX: s.maxX + e,
    minZ: s.minZ - e,
    maxZ: s.maxZ + e
  };
}
function qn(s, e, t = ut) {
  const n = ll(e, t);
  return [
    new s.Plane(new s.Vector3(1, 0, 0), -n.minX),
    new s.Plane(new s.Vector3(-1, 0, 0), n.maxX),
    new s.Plane(new s.Vector3(0, 0, 1), -n.minZ),
    new s.Plane(new s.Vector3(0, 0, -1), n.maxZ)
  ];
}
function de(s = "Operation aborted") {
  const e = new Error(s);
  return e.name = "AbortError", e;
}
function Ze(s) {
  if (s?.aborted) throw s.reason ?? de();
}
function Ge(s) {
  return String(s?.extras?.contentId ?? s?.extras?.source?.contentId ?? "");
}
function Zn(s, e) {
  return new Promise((t, n) => {
    const a = setTimeout(t, s);
    e?.addEventListener("abort", () => {
      clearTimeout(a), n(e.reason ?? de());
    }, { once: !0 });
  });
}
function ve(s) {
  s?.traverse?.((e) => {
    if (!e.userData?.convertedSessionOwned) return;
    e.geometry?.dispose?.();
    const t = Array.isArray(e.material) ? e.material : [e.material];
    for (const n of t)
      n?.map?.userData?.convertedSessionOwned && n.map.dispose?.(), n?.dispose?.();
  }), s?.removeFromParent?.();
}
function cl(s, e) {
  const t = new s.Box3(), n = new s.Box3();
  let a = !1;
  return e.updateWorldMatrix(!0, !0), e.traverse((i) => {
    !i.isMesh || !i.geometry?.attributes?.position || (i.geometry.boundingBox || i.geometry.computeBoundingBox(), n.copy(i.geometry.boundingBox).applyMatrix4(i.matrixWorld), t.union(n), a = !0);
  }), a ? t : null;
}
function za(s, e, t, n = Pa) {
  if (!t || !(t.maxX > t.minX) || !(t.maxZ > t.minZ)) return null;
  const a = new Uint8Array(n * n), i = new Uint8Array(n * n), r = new Float32Array(n * n);
  r.fill(-1 / 0);
  const l = t.maxX - t.minX, o = t.maxZ - t.minZ, c = l / n, d = o / n, u = Math.hypot(c, d) * 0.58, h = u * u, f = new s.Vector3(), p = new s.Vector3(), y = new s.Vector3(), g = new s.Vector3(), b = new s.Vector3(), x = new s.Vector3();
  return {
    THREE: s,
    meshes: e,
    bounds: t,
    size: n,
    covered: a,
    horizontalCovered: i,
    maximumHorizontalY: r,
    width: l,
    depth: o,
    cellX: c,
    cellZ: d,
    edgeToleranceSquared: h,
    a: f,
    b: p,
    c: y,
    ab: g,
    ac: b,
    normal: x,
    read: (w, T, M, S) => {
      M.fromBufferAttribute(w, T).applyMatrix4(S);
    },
    edgeDistanceSquared: (w, T, M, S, R, E) => {
      const O = R - M, I = E - S, A = O * O + I * I, F = A > 1e-12 ? Math.max(0, Math.min(1, ((w - M) * O + (T - S) * I) / A)) : 0, k = w - (M + O * F), C = T - (S + I * F);
      return k * k + C * C;
    },
    meshIndex: 0,
    triangleOffset: 0,
    meshState: null
  };
}
function Cs(s, { deadline: e = 1 / 0, maxTriangles: t = 1 / 0 } = {}) {
  if (!s) return !0;
  const {
    meshes: n,
    bounds: a,
    size: i,
    covered: r,
    horizontalCovered: l,
    maximumHorizontalY: o,
    width: c,
    depth: d,
    cellX: u,
    cellZ: h,
    edgeToleranceSquared: f,
    a: p,
    b: y,
    c: g,
    ab: b,
    ac: x,
    normal: m,
    read: v,
    edgeDistanceSquared: w
  } = s;
  let T = 0;
  for (; s.meshIndex < n.length && T < t && !(T > 0 && performance.now() >= e); ) {
    if (!s.meshState) {
      const N = n[s.meshIndex], P = N.geometry?.attributes?.position;
      if (!P) {
        s.meshIndex++, s.triangleOffset = 0;
        continue;
      }
      N.updateWorldMatrix(!0, !1);
      const V = N.geometry.index;
      s.meshState = {
        mesh: N,
        position: P,
        index: V,
        count: V ? V.count : P.count,
        matrixWorld: N.matrixWorld.clone()
      };
    }
    const { position: M, index: S, count: R, matrixWorld: E } = s.meshState;
    if (s.triangleOffset + 2 >= R) {
      s.meshIndex++, s.triangleOffset = 0, s.meshState = null;
      continue;
    }
    const O = s.triangleOffset;
    s.triangleOffset += 3, T++;
    const I = S ? S.getX(O) : O, A = S ? S.getX(O + 1) : O + 1, F = S ? S.getX(O + 2) : O + 2;
    v(M, I, p, E), v(M, A, y, E), v(M, F, g, E), m.crossVectors(b.subVectors(y, p), x.subVectors(g, p)).normalize();
    const k = Math.abs(m.y) >= 0.72, C = Math.max(0, Math.floor((Math.min(p.x, y.x, g.x) - a.minX) / u) - 1), D = Math.min(i - 1, Math.floor((Math.max(p.x, y.x, g.x) - a.minX) / u) + 1), G = Math.max(0, Math.floor((Math.min(p.z, y.z, g.z) - a.minZ) / h) - 1), L = Math.min(i - 1, Math.floor((Math.max(p.z, y.z, g.z) - a.minZ) / h) + 1), j = (y.z - g.z) * (p.x - g.x) + (g.x - y.x) * (p.z - g.z);
    for (let N = G; N <= L; N++) for (let P = C; P <= D; P++) {
      const V = a.minX + (P + 0.5) * u, Z = a.minZ + (N + 0.5) * h;
      let X = !1, Q = Math.min(p.y, y.y, g.y);
      if (Math.abs(j) > 1e-10) {
        const Y = ((y.z - g.z) * (V - g.x) + (g.x - y.x) * (Z - g.z)) / j, z = ((g.z - p.z) * (V - g.x) + (p.x - g.x) * (Z - g.z)) / j, q = 1 - Y - z;
        X = Y >= -0.035 && z >= -0.035 && q >= -0.035, X && (Q = Y * p.y + z * y.y + q * g.y);
      }
      if (X || (X = Math.min(
        w(V, Z, p.x, p.z, y.x, y.z),
        w(V, Z, y.x, y.z, g.x, g.z),
        w(V, Z, g.x, g.z, p.x, p.z)
      ) <= f), !X) continue;
      const U = N * i + P;
      r[U] = 1, k && (l[U] = 1, o[U] = Math.max(o[U], Q));
    }
  }
  return s.meshIndex >= n.length;
}
function Fs(s) {
  const e = [];
  for (let t = 0; t < s.covered.length; t++)
    s.covered[t] && e.push(t);
  return {
    size: s.size,
    bounds: { ...s.bounds },
    covered: s.covered,
    horizontalCovered: s.horizontalCovered,
    maximumHorizontalY: s.maximumHorizontalY,
    coveredCellIndices: Uint16Array.from(e)
  };
}
function ul(s, e, t, n = Pa) {
  const a = za(s, e, t, n);
  return a ? (Cs(a), Fs(a)) : null;
}
function dl(s) {
  let e = 0;
  for (const t of s) {
    const n = t.geometry?.attributes?.position;
    n && (e += Math.floor((t.geometry.index?.count ?? n.count) / 3));
  }
  return e;
}
function oe(s) {
  const e = String(s).split("/").map(Number);
  return { zoom: e[0], x: e[1], y: e[2], h: e[3] ?? 0 };
}
function It(s, e) {
  const t = oe(s), n = t.zoom - e;
  return `${e}/${t.x >> n}/${t.y >> n}/0`;
}
function parentTransitionId(s, e) {
  const t = oe(e), n = t.zoom === 20 ? 17 : t.zoom - 1;
  if (n < 15 || !s?.transitions) return;
  const a = It(e, n), i = s.transitions[a];
  return i?.childZoom === t.zoom && i.expected?.includes(e) ? a : void 0;
}
function ye(s, e) {
  const t = Math.round(Ss + s.z / mt), n = Math.round(Rs - s.x / pt), a = 20 - e;
  return `${e}/${t >> a}/${n >> a}/0`;
}
function hl(s) {
  return { "-1": "failed", 0: "unloaded", 1: "queued", 2: "downloading", 3: "parsing", 4: "loaded" }[s] ?? "not-indexed";
}
function Te(s, e) {
  return !s || !e ? 1 / 0 : Math.hypot(
    Math.max(e.minX - s.x, 0, s.x - e.maxX),
    Math.max(e.minZ - s.z, 0, s.z - e.maxZ)
  );
}
function fl(s, e, t) {
  const n = (e ?? []).filter((a) => Number.isFinite(a?.x) && Number.isFinite(a?.z));
  return [...s].map((a) => ({
    record: a,
    distance: n.length ? Math.min(...n.map((i) => Te(i, a.coverageBounds ?? a.logicalBounds))) : 1 / 0
  })).sort((a, i) => a.distance - i.distance || String(a.record.id).localeCompare(String(i.record.id))).slice(0, Math.max(0, t)).map((a) => a.record);
}
function pl(s, {
  liveFocus: e,
  locomotion: t = "walk",
  horizontalSpeed: n = 0,
  altitudeAboveGround: a = 0,
  activeExactIds: i = /* @__PURE__ */ new Set(),
  activeCoarseIds: r = /* @__PURE__ */ new Set()
} = {}) {
  if (!s?.splatMeta || a >= 180) return !1;
  const l = Te(e, s.coverageBounds ?? s.logicalBounds), o = t === "flight" || t === "glider";
  if (o && s.companion && l <= Da)
    return !0;
  if (o && n >= 18)
    return !1;
  if (!e) return !0;
  const d = s.companionWasVisible || s.companionState === "loading" ? Ia : Oa;
  return l <= d && !!(s.selected || s.pinCount > 0 || i.has(s.id) || r.has(s.id) || l <= 90);
}
function ml(s) {
  const { zoom: e, x: t, y: n } = oe(s);
  return e === 20 ? `15/${t >> 5}/${n >> 5}/0` : null;
}
function bl(s, e, t, n, a) {
  if (!s || !e || !a || n < t) return !1;
  let i = Math.max(0, Number.isFinite(t) ? t : 0), r = Number.isFinite(n) ? n : 1 / 0;
  for (const [l, o, c] of [
    ["x", a.minX, a.maxX],
    ["z", a.minZ, a.maxZ]
  ]) {
    const d = s[l], u = e[l];
    if (Math.abs(u) < 1e-12) {
      if (d < o || d >= c) return !1;
      continue;
    }
    let h = (o - d) / u, f = (c - d) / u;
    if (h > f && ([h, f] = [f, h]), i = Math.max(i, h), r = Math.min(r, f), r < i) return !1;
  }
  return r >= i;
}
function gl(s, e, t, n, a, i, r, l, o, c) {
  const d = (u, h) => {
    if (Math.abs(u) + Math.abs(h) < 1e-12) return !1;
    const f = s * u + e * h, p = t * u + n * h, y = a * u + i * h, g = r * u + l * h, b = o * Math.abs(u) + c * Math.abs(h);
    return Math.max(f, p, y) < g - b || Math.min(f, p, y) > g + b;
  };
  return !d(-(n - e), t - s) && !d(-(i - n), a - t) && !d(-(e - i), s - a);
}
function xl(s, e) {
  return s ? {
    ...s,
    tileId: e.id,
    sourceZoom: e.zoom,
    oceanOnly: !!e.oceanOnlyPage,
    oceanSurfaceY: Number.isFinite(e.oceanSurfaceY) ? e.oceanSurfaceY : null,
    rendered: !0,
    collisionOnly: !1
  } : null;
}
function ms(s, e, t) {
  if (!Array.isArray(t) || t.length < 3) return !1;
  let n = !1;
  for (let a = 0, i = t.length - 1; a < t.length; i = a++) {
    const [r, l] = t[a], [o, c] = t[i];
    l > e != c > e && s < (o - r) * (e - l) / (c - l) + r && (n = !n);
  }
  return n;
}
function yl(s, e = 0) {
  const t = [...new Map(s.filter((o) => Number.isFinite(o?.[0]) && Number.isFinite(o?.[1])).map((o) => [`${o[0].toFixed(5)},${o[1].toFixed(5)}`, [o[0], o[1]]])).values()].sort((o, c) => o[0] - c[0] || o[1] - c[1]);
  if (t.length < 3) return t;
  const n = (o, c, d) => (c[0] - o[0]) * (d[1] - o[1]) - (c[1] - o[1]) * (d[0] - o[0]), a = [], i = [];
  for (const o of t) {
    for (; a.length >= 2 && n(a.at(-2), a.at(-1), o) <= 0; ) a.pop();
    a.push(o);
  }
  for (const o of [...t].reverse()) {
    for (; i.length >= 2 && n(i.at(-2), i.at(-1), o) <= 0; ) i.pop();
    i.push(o);
  }
  const r = a.slice(0, -1).concat(i.slice(0, -1));
  if (!(e > 0)) return r;
  const l = r.reduce((o, c) => [o[0] + c[0] / r.length, o[1] + c[1] / r.length], [0, 0]);
  return r.map(([o, c]) => {
    const d = o - l[0], u = c - l[1], h = Math.hypot(d, u) || 1;
    return [o + d / h * e, c + u / h * e];
  });
}
function Ae(s, e = s.center?.[0] ?? 0, t = s.center?.[2] ?? 0) {
  const n = s.roadInfill?.plane;
  if (n?.valid && Array.isArray(n.coefficientsYeqAxPlusBzPlusC)) {
    const [a, i, r] = n.coefficientsYeqAxPlusBzPlusC;
    return a * e + i * t + r;
  }
  return s.center?.[1] ?? s.removalMask?.minY ?? 0;
}
const vl = 0.16, wl = 0.14;
function Wn(s, e, t = 0.2, n = 1) {
  if (!Array.isArray(e) || e.length < 3) return !1;
  const a = Number(s.headingRadians) || 0, i = Math.cos(a), r = Math.sin(a), l = Number(s.size?.[0] ?? 4.45) * 0.5 + t, o = Number(s.size?.[2] ?? 2.05) * 0.5 + t, c = Number(s.size?.[1] ?? 1.7) + 0.85;
  let d = 0;
  for (const u of e) {
    const h = u.x - s.center[0], f = u.z - s.center[2], p = h * i + f * r, y = -h * r + f * i, g = u.y - Ae(s, u.x, u.z);
    Math.abs(p) <= l && Math.abs(y) <= o && g >= -0.2 && g <= c && d++;
  }
  return d >= n;
}
function Kn(s, e = 2.45, t = 2.4) {
  if (!Array.isArray(s) || s.length < 3) return !1;
  const n = (g, b) => Math.hypot(g.x - b.x, g.y - b.y, g.z - b.z), a = n(s[0], s[1]), i = n(s[1], s[2]), r = n(s[2], s[0]);
  if (Math.max(a, i, r) > e) return !1;
  const l = s[1].x - s[0].x, o = s[1].y - s[0].y, c = s[1].z - s[0].z, d = s[2].x - s[0].x, u = s[2].y - s[0].y, h = s[2].z - s[0].z, f = o * h - c * u, p = c * d - l * h, y = l * u - o * d;
  return Math.hypot(f, p, y) * 0.5 <= t;
}
function Tl(s, e, t = {}) {
  const n = new Map(s.map((b) => [b.triangleIndex, b])), a = /* @__PURE__ */ new Map();
  for (const b of s) for (const x of b.vertexKeys)
    a.has(x) || a.set(x, []), a.get(x).push(b.triangleIndex);
  const i = new Set(e.filter((b) => n.has(b))), r = [], l = /* @__PURE__ */ new Set();
  for (const b of i) {
    if (l.has(b)) continue;
    const x = /* @__PURE__ */ new Set([b]), m = [b];
    for (let v = 0; v < m.length; v++) {
      const w = n.get(m[v]);
      for (const T of w.vertexKeys) for (const M of a.get(T) ?? [])
        x.has(M) || (x.add(M), m.push(M));
    }
    for (const v of x) l.add(v);
    r.push(x);
  }
  if (!r.length) return [];
  const o = (b) => {
    const x = [...b].map((m) => n.get(m)?.bounds).filter(Boolean);
    return x.length ? x.reduce((m, v) => ({
      minX: Math.min(m.minX, v.minX),
      minY: Math.min(m.minY, v.minY),
      minZ: Math.min(m.minZ, v.minZ),
      maxX: Math.max(m.maxX, v.maxX),
      maxY: Math.max(m.maxY, v.maxY),
      maxZ: Math.max(m.maxZ, v.maxZ)
    }), { minX: 1 / 0, minY: 1 / 0, minZ: 1 / 0, maxX: -1 / 0, maxY: -1 / 0, maxZ: -1 / 0 }) : null;
  }, c = new Set((t.authoritativeSeedTriangleIndices ?? e).filter((b) => n.has(b))), d = r.filter((b) => [...b].some((x) => c.has(x)));
  if (!d.length) return [];
  const u = t.targetCenter, h = (b) => {
    const x = o(b), m = x && Array.isArray(u) ? Math.hypot(
      Math.max(0, x.minX - u[0], u[0] - x.maxX),
      Math.max(0, x.minZ - u[2], u[2] - x.maxZ)
    ) : 0, v = [...b].filter((w) => c.has(w)).length;
    return { centerDistance: m, authoritativeCount: v, triangles: b.size };
  }, f = d.reduce((b, x) => {
    const m = h(x), v = h(b);
    return m.centerDistance !== v.centerDistance ? m.centerDistance < v.centerDistance ? x : b : m.authoritativeCount !== v.authoritativeCount ? m.authoritativeCount > v.authoritativeCount ? x : b : m.triangles > v.triangles ? x : b;
  }, d[0]), p = o(f), y = (b, x) => Math.hypot(
    Math.max(0, b.minX - x.maxX, x.minX - b.maxX),
    Math.max(0, b.minY - x.maxY, x.minY - b.maxY),
    Math.max(0, b.minZ - x.maxZ, x.minZ - b.maxZ)
  ), g = /* @__PURE__ */ new Set();
  for (const b of r) {
    const x = o(b);
    if (!(b !== f && p && x && y(p, x) > 0.28))
      for (const m of b) g.add(m);
  }
  return [...g];
}
function Al(s) {
  return `${Math.round(s.x * 100)},${Math.round(s.y * 100)},${Math.round(s.z * 100)}`;
}
function Ml(s, e = [], t = [], n = {}) {
  const a = Math.floor((s?.length ?? 0) / 9);
  if (!a) return { positions: [...s ?? []], uvs: [...e], normals: [...t], mirrored: !1, sourceSideCounts: [0, 0] };
  const i = Number(n.centerBand ?? 0.08), r = Number(n.imbalanceRatio ?? 0.68), l = [[], []], o = [];
  for (let g = 0; g < a; g++) {
    const b = g * 9, x = (s[b] + s[b + 3] + s[b + 6]) / 3;
    Math.abs(x) <= i ? o.push(g) : l[x < 0 ? 0 : 1].push(g);
  }
  if (n.enabled === !1)
    return {
      positions: [...s],
      uvs: [...e],
      normals: [...t],
      mirrored: !1,
      sourceSideCounts: l.map((g) => g.length),
      centerTriangleCount: o.length
    };
  const c = Math.min(l[0].length, l[1].length), d = Math.max(l[0].length, l[1].length);
  if (d < 8 || c / d >= r)
    return { positions: [...s], uvs: [...e], normals: [...t], mirrored: !1, sourceSideCounts: l.map((g) => g.length) };
  const u = l[0].length >= l[1].length ? 0 : 1, h = [], f = [], p = [], y = (g, b = !1) => {
    const x = b ? [0, 2, 1] : [0, 1, 2];
    for (const m of x) {
      const v = g * 9 + m * 3;
      if (h.push(b ? -s[v] : s[v], s[v + 1], s[v + 2]), e.length) {
        const w = g * 6 + m * 2;
        f.push(e[w], e[w + 1]);
      }
      t.length && p.push(b ? -t[v] : t[v], t[v + 1], t[v + 2]);
    }
  };
  for (const g of o) y(g);
  for (const g of l[u])
    y(g), y(g, !0);
  return {
    positions: h,
    uvs: f,
    normals: p,
    mirrored: !0,
    dominantSide: u === 0 ? "negative-x" : "positive-x",
    sourceSideCounts: l.map((g) => g.length),
    centerTriangleCount: o.length
  };
}
function bs(s, e, t = vl, n = wl) {
  if (!Array.isArray(e) || e.length < 3) return [];
  const a = Number(s.headingRadians) || 0, i = Math.cos(a), r = Math.sin(a), l = Number(s.size?.[0] ?? 4.45) * 0.5 + t, o = Number(s.size?.[2] ?? 2.05) * 0.5 + n, c = Number(s.size?.[1] ?? 1.7) + 0.55;
  let d = e.map((h) => {
    const f = h.x - s.center[0], p = h.z - s.center[2];
    return {
      ...h,
      along: f * i + p * r,
      lateral: -f * r + p * i,
      height: h.y - Ae(s, h.x, h.z)
    };
  });
  const u = [
    (h) => l - h.along,
    (h) => l + h.along,
    (h) => o - h.lateral,
    (h) => o + h.lateral,
    (h) => h.height - 0.025,
    (h) => c - h.height
  ];
  for (const h of u) {
    const f = [];
    for (let p = 0; p < d.length; p++) {
      const y = d[p], g = d[(p + d.length - 1) % d.length], b = h(y), x = h(g), m = b >= 0, v = x >= 0;
      if (m !== v) {
        const w = x / (x - b), T = {};
        for (const M of ["x", "y", "z", "u", "v", "nx", "ny", "nz", "cr", "cg", "cb", "alpha", "bx", "by", "bz", "kind", "along", "lateral", "height"]) {
          const S = Number(g[M]), R = Number(y[M]);
          Number.isFinite(S) && Number.isFinite(R) && (T[M] = S + (R - S) * w);
        }
        f.push(T);
      }
      m && f.push(y);
    }
    if (d = f, d.length < 3) break;
  }
  return d;
}
function gs(s = []) {
  return s.map((e) => Array.isArray(e) ? { sourceTileKey: String(e[0]), sourceTriangleIndex: Number(e[1]) } : {
    sourceTileKey: String(e.sourceTileKey ?? e.tileKey ?? e.contentId ?? ""),
    sourceTriangleIndex: Number(e.sourceTriangleIndex ?? e.triangleIndex)
  });
}
function Sl(s, e, t = ct) {
  return e ? [...s].filter((n) => n?.sourceIds?.includes(e)).slice(0, t) : [];
}
function Rl(s, e, t, n) {
  if (!s?.center || !s?.size || !s?.removalMask) return !1;
  const a = (e[0] + t[0] + n[0]) / 3, i = (e[1] + t[1] + n[1]) / 3, r = (e[2] + t[2] + n[2]) / 3, l = s.headingRadians ?? 0, o = Math.cos(l), c = Math.sin(l), d = a - s.center[0], u = r - s.center[2], h = o * d + c * u, f = -c * d + o * u;
  return Math.abs(h) < s.size[0] * 0.56 && Math.abs(f) < s.size[2] * 0.62 && i > s.removalMask.minY - 0.02 && i < s.removalMask.maxY + 0.08;
}
function El(s, e, t, n, a = 2) {
  return Number.isFinite(s) && (e[1] + t[1] + n[1]) / 3 <= s + a;
}
function _a(positions, colors, alpha, triangleCount, sourceKinds = null, sourceKindsTrusted = !1) {
  const cells = /* @__PURE__ */ new Map(), records = new Array(triangleCount), colorStride = colors.length === triangleCount * 3 ? 3 : 9, alphaStride = alpha.length === triangleCount ? 1 : 3, kindStride = sourceKinds?.length === triangleCount ? 1 : 3, colorScale = colors.BYTES_PER_ELEMENT === 1 ? 1 / 255 : 1, alphaScale = alpha.BYTES_PER_ELEMENT === 1 ? 1 / 255 : 1;
  for (let triangle = 0; triangle < triangleCount; triangle++) {
    const positionBase = triangle * 9, colorBase = triangle * colorStride, alphaBase = triangle * alphaStride, x = (positions[positionBase] + positions[positionBase + 3] + positions[positionBase + 6]) / 3, y = (positions[positionBase + 1] + positions[positionBase + 4] + positions[positionBase + 7]) / 3, z = (positions[positionBase + 2] + positions[positionBase + 5] + positions[positionBase + 8]) / 3, r = (colorStride === 3 ? colors[colorBase] : (colors[colorBase] + colors[colorBase + 3] + colors[colorBase + 6]) / 3) * colorScale, g = (colorStride === 3 ? colors[colorBase + 1] : (colors[colorBase + 1] + colors[colorBase + 4] + colors[colorBase + 7]) / 3) * colorScale, b = (colorStride === 3 ? colors[colorBase + 2] : (colors[colorBase + 2] + colors[colorBase + 5] + colors[colorBase + 8]) / 3) * colorScale, a = (alphaStride === 1 ? alpha[alphaBase] : (alpha[alphaBase] + alpha[alphaBase + 1] + alpha[alphaBase + 2]) / 3) * alphaScale, maximum = Math.max(r, g, b), minimum = Math.min(r, g, b), saturation = (maximum - minimum) / Math.max(1e-3, maximum), gx = Math.floor(x / 2.5), gz = Math.floor(z / 2.5), key = `${gx}/${gz}`, sourceKind = sourceKinds?.[triangle * kindStride] || 0, green = sourceKindsTrusted ? sourceKind === 1 && a > 0.035 && g > 0.07 && saturation > 0.2 && g > r * 1.035 && g > b * 1.07 && g - r > 0.018 : a > 0.035 && g > 0.07 && saturation > 0.2 && g > r * 1.075 && g > b * 1.105 && g - r > 0.018;
    if (records[triangle] = { x, y, z, r, g, b, a, green, sourceKind, gx, gz, key }, !green) continue;
    const cell = cells.get(key) || { gx, gz, count: 0, sumX: 0, sumZ: 0, minX: 1 / 0, maxX: -1 / 0, minY: 1 / 0, maxY: -1 / 0, minZ: 1 / 0, maxZ: -1 / 0 };
    cell.count++, cell.sumX += x, cell.sumZ += z, cell.minX = Math.min(cell.minX, x), cell.maxX = Math.max(cell.maxX, x), cell.minY = Math.min(cell.minY, y), cell.maxY = Math.max(cell.maxY, y), cell.minZ = Math.min(cell.minZ, z), cell.maxZ = Math.max(cell.maxZ, z), cells.set(key, cell);
  }
  const denseCells = new Set([...cells].filter(([, cell]) => cell.count >= 4).map(([key]) => key)), visited = /* @__PURE__ */ new Set(), trees = [];
  for (const key of denseCells) {
    if (visited.has(key)) continue;
    const queue = [key], component = [];
    for (visited.add(key); queue.length; ) {
      const currentKey = queue.pop(), cell = cells.get(currentKey);
      if (!cell) continue;
      component.push(cell);
      for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) {
        if (!dx && !dz) continue;
        const neighbor = `${cell.gx + dx}/${cell.gz + dz}`;
        denseCells.has(neighbor) && !visited.has(neighbor) && (visited.add(neighbor), queue.push(neighbor));
      }
    }
    const tree = { members: new Set(component.map((cell) => `${cell.gx}/${cell.gz}`)), count: 0, sumX: 0, sumZ: 0, minX: 1 / 0, maxX: -1 / 0, minY: 1 / 0, maxY: -1 / 0, minZ: 1 / 0, maxZ: -1 / 0 };
    for (const cell of component)
      tree.count += cell.count, tree.sumX += cell.sumX, tree.sumZ += cell.sumZ, tree.minX = Math.min(tree.minX, cell.minX), tree.maxX = Math.max(tree.maxX, cell.maxX), tree.minY = Math.min(tree.minY, cell.minY), tree.maxY = Math.max(tree.maxY, cell.maxY), tree.minZ = Math.min(tree.minZ, cell.minZ), tree.maxZ = Math.max(tree.maxZ, cell.maxZ);
    const width = tree.maxX - tree.minX, depth = tree.maxZ - tree.minZ, height = tree.maxY - tree.minY, spread = Math.max(width, depth), shape = spread / Math.max(0.1, Math.min(width, depth));
    tree.count < 28 || width < 1.25 || depth < 1.25 || spread > 15 || shape > 4.2 || height < 3.1 || height / spread > 4.5 || (tree.x = tree.sumX / tree.count, tree.z = tree.sumZ / tree.count, tree.spread = spread, trees.push(tree));
  }
  const treeByCell = /* @__PURE__ */ new Map();
  for (const tree of trees) for (const member of tree.members) {
    const [gx, gz] = member.split("/").map(Number);
    for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) {
      const key = `${gx + dx}/${gz + dz}`;
      treeByCell.has(key) || treeByCell.set(key, tree);
    }
  }
  const kinds = new Uint8Array(triangleCount);
  let leafCount = 0, woodCount = 0;
  for (let triangle = 0; triangle < triangleCount; triangle++) {
    const record = records[triangle], tree = treeByCell.get(record.key), maximum = Math.max(record.r, record.g, record.b), minimum = Math.min(record.r, record.g, record.b), saturation = (maximum - minimum) / Math.max(1e-3, maximum);
    let kind = 0;
    if (tree && record.green) kind = 1;
    else if (tree && (sourceKindsTrusted && record.sourceKind === 2 || !sourceKindsTrusted && record.a > 0.035 && maximum > 0.035 && maximum < 0.56 && saturation > 0.1 && record.r > record.b * 1.1 && record.g > record.b * 1.06)) {
      const distance = Math.hypot(record.x - tree.x, record.z - tree.z), trunkRadius = Math.max(0.48, Math.min(1, tree.spread * 0.12)), canopyRadius = Math.max(1.5, tree.spread * 0.56), trunk = record.y <= tree.minY + 0.65 && distance <= trunkRadius, canopy = record.y > tree.minY - 0.5 && record.y <= tree.maxY + 0.5 && distance <= canopyRadius;
      (trunk || canopy) && (kind = 2);
    }
    kind === 1 ? leafCount++ : kind === 2 && woodCount++, kinds[triangle] = kind;
  }
  return { kinds, leafCount, woodCount, treeCount: trees.length };
}
const Cl = `const classifyTriangleSplatKinds=${_a.toString()};
self.onmessage=event=>{try{const {id,buffer,meta}=event.data,view=new DataView(buffer),stride=Number(meta.stride),count=buffer.byteLength/stride;if(!Number.isInteger(count)||![22,23].includes(stride))throw new Error('Unsupported splat stride '+stride);const positions=new Float32Array(count*9),packedPositions=meta.packed?new Int16Array(count*9):null,colors=new Uint8Array(count*3),alpha=new Uint8Array(count),sourceKinds=new Uint8Array(count),offset=meta.sourceOffsetYUp;for(let i=0;i<count;i++){const source=i*stride,sourceKind=stride===23?view.getUint8(source+22):0,r=view.getUint8(source+18),g=view.getUint8(source+19),b=view.getUint8(source+20),a=view.getUint8(source+21);colors[i*3]=r;colors[i*3+1]=g;colors[i*3+2]=b;alpha[i]=a;sourceKinds[i]=sourceKind;for(let corner=0;corner<3;corner++){const src=source+corner*6,dest=i*9+corner*3,qx=view.getInt16(src,true),qy=view.getInt16(src+2,true),qz=view.getInt16(src+4,true);if(packedPositions){packedPositions[dest]=qx;packedPositions[dest+1]=qy;packedPositions[dest+2]=qz}positions[dest]=qx*meta.scale+offset[0];positions[dest+1]=qy*meta.scale+offset[1];positions[dest+2]=qz*meta.scale+offset[2]}}const sourceKindsTrusted=stride===23&&sourceKinds.some(kind=>kind!==0),classification=classifyTriangleSplatKinds(positions,colors,alpha,count,sourceKinds,sourceKindsTrusted),kinds=classification.kinds,outputPositions=packedPositions||positions;self.postMessage({id,positions:outputPositions,colors,alpha,kinds,leafCount:classification.leafCount,woodCount:classification.woodCount,treeCount:classification.treeCount,sourceKindsTrusted},[outputPositions.buffer,colors.buffer,alpha.buffer,kinds.buffer])}catch(error){self.postMessage({id:event.data.id,error:String(error&&error.message||error)})}}`;
class Fl {
  constructor({ THREE: e, group: t, fetchImpl: n, workerCount: a = 2 }) {
    this.THREE = e, this.group = t, this.fetchImpl = n, this.packedSplats = typeof globalThis.location > "u" || new URLSearchParams(globalThis.location.search).get("legacySplats") !== "1", this.companions = /* @__PURE__ */ new Set(), this.activeOverlays = [], this.oceanPlane = null, this.decodeSequence = 0, this.decodeQueue = [], this.decodeJobs = /* @__PURE__ */ new Map(), this.decodeWorkerUrl = null, this.decodeWorkers = [], this.byteStats = { source: 0, decoded: 0, gpu: 0, legacyEquivalent: 0 }, typeof globalThis.Worker == "function" && typeof globalThis.Blob == "function" && typeof globalThis.URL?.createObjectURL == "function" && (this.decodeWorkerUrl = globalThis.URL.createObjectURL(
      new globalThis.Blob([Cl], { type: "text/javascript" })
    ), this.decodeWorkers = Array.from({ length: Math.max(0, Math.min(2, Number(a) || 0)) }, () => {
      const i = new globalThis.Worker(this.decodeWorkerUrl), r = { worker: i, job: null };
      return i.onmessage = (l) => this.#a(r, l.data), i.onerror = (l) => this.#a(r, {
        id: r.job?.id,
        error: l.message || "Splat decode worker failed"
      }), r;
    }));
  }
  #n(e, t) {
    const n = new DataView(e), a = Number(t.stride), i = e.byteLength / a;
    if (!Number.isInteger(i) || ![22, 23].includes(a)) throw new Error(`Unsupported splat stride ${a}`);
    const r = new Float32Array(i * 9), l = this.packedSplats ? new Int16Array(i * 9) : r, o = new Float32Array(i * 9), c = new Float32Array(i * 3), d = new Uint8Array(i * 3), u = new Uint8Array(i), h = new Uint8Array(i * 3), f = t.sourceOffsetYUp;
    for (let p = 0; p < i; p++) {
      const y = p * a, g = a === 23 ? n.getUint8(y + 22) : 0;
      d[p * 3] = n.getUint8(y + 18), d[p * 3 + 1] = n.getUint8(y + 19), d[p * 3 + 2] = n.getUint8(y + 20), u[p] = n.getUint8(y + 21);
      for (let b = 0; b < 3; b++) {
        const x = y + b * 6, m = p * 9 + b * 3, v = n.getInt16(x, !0), w = n.getInt16(x + 2, !0), T = n.getInt16(x + 4, !0);
        this.packedSplats && (l[m] = v, l[m + 1] = w, l[m + 2] = T), r[m] = v * t.scale + f[0], r[m + 1] = w * t.scale + f[1], r[m + 2] = T * t.scale + f[2], o[m] = d[p * 3] / 255, o[m + 1] = d[p * 3 + 1] / 255, o[m + 2] = d[p * 3 + 2] / 255, c[p * 3 + b] = u[p] / 255, h[p * 3 + b] = g;
      }
    }
    const p = a === 23 && h.some((y) => y !== 0), y = _a(
      r,
      o,
      c,
      i,
      h,
      p
    );
    const g = y.kinds;
    return {
      positions: l,
      colors: d,
      alpha: u,
      kinds: g,
      leafCount: y.leafCount,
      woodCount: y.woodCount,
      treeCount: y.treeCount,
      sourceKindsTrusted: p,
      positionScale: Number(t.scale),
      positionOffset: [...t.sourceOffsetYUp]
    };
  }
  #l(e, t, n) {
    return Ze(n), this.decodeWorkers.length ? new Promise((a, i) => {
      const r = {
        id: ++this.decodeSequence,
        buffer: e,
        meta: {
          stride: Number(t.stride),
          scale: Number(t.scale),
          sourceOffsetYUp: [...t.sourceOffsetYUp],
          packed: this.packedSplats
        },
        signal: n,
        resolve: a,
        reject: i,
        cancelled: !1,
        started: !1
      };
      r.onAbort = () => {
        r.cancelled || (r.cancelled = !0, r.started || (this.decodeQueue = this.decodeQueue.filter((l) => l !== r)), i(n.reason ?? de()));
      }, n?.addEventListener("abort", r.onAbort, { once: !0 }), this.decodeJobs.set(r.id, r), this.decodeQueue.push(r), this.#s();
    }) : Promise.resolve(this.#n(e, t));
  }
  #s() {
    for (const e of this.decodeWorkers) {
      if (e.job) continue;
      let t = this.decodeQueue.shift();
      for (; t?.cancelled; )
        this.decodeJobs.delete(t.id), t = this.decodeQueue.shift();
      t && (t.started = !0, e.job = t, e.worker.postMessage({ id: t.id, buffer: t.buffer, meta: t.meta }, [t.buffer]));
    }
  }
  #a(e, t) {
    const n = e.job;
    e.job = null, n && (this.decodeJobs.delete(n.id), n.signal?.removeEventListener("abort", n.onAbort), n.cancelled || (t?.error ? n.reject(new Error(t.error)) : n.resolve({
      positions: t.positions,
      colors: t.colors,
      alpha: t.alpha,
      kinds: t.kinds,
      leafCount: t.leafCount,
      woodCount: t.woodCount,
      treeCount: t.treeCount,
      sourceKindsTrusted: t.sourceKindsTrusted,
      positionScale: Number(n.meta.scale),
      positionOffset: [...n.meta.sourceOffsetYUp]
    }))), this.#s();
  }
  _createMaterial(e, t = !1, n = this.packedSplats) {
    const a = n ? `attribute vec3 splatPosition0;attribute vec3 splatPosition1;attribute vec3 splatPosition2;attribute vec3 splatColor;attribute float splatAlpha;attribute float splatKind;attribute float splatEnabled;uniform float splatScale;uniform vec3 splatOffset;varying vec3 vc;varying float va;varying float vk;varying vec3 vb;varying float ve;void main(){float corner=position.x;vec3 p=(corner<.5?splatPosition0:(corner<1.5?splatPosition1:splatPosition2))*splatScale+splatOffset;vc=splatColor;va=splatAlpha;vk=splatKind;ve=splatEnabled;vb=corner<.5?vec3(1.,0.,0.):(corner<1.5?vec3(0.,1.,0.):vec3(0.,0.,1.));vec4 mvPosition=modelViewMatrix*vec4(p,1.0);gl_Position=projectionMatrix*mvPosition;` : t ? `attribute float alpha;attribute float kind;attribute vec3 barycentric;varying float va;varying float vk;varying vec3 vb;varying float ve;void main(){va=alpha;vk=kind;ve=1.;vb=barycentric;vec4 mvPosition=modelViewMatrix*vec4(position,1.0);gl_Position=projectionMatrix*mvPosition;` : `attribute float alpha;attribute vec3 barycentric;varying vec3 vc;varying float va;varying float vk;varying vec3 vb;varying float ve;void main(){vc=color;va=alpha;vk=0.;ve=1.;vb=barycentric;vec4 mvPosition=modelViewMatrix*vec4(position,1.0);gl_Position=projectionMatrix*mvPosition;`, i = t ? `uniform float alphaConcentration;uniform float alphaPreFactor;varying float va;varying float vk;varying vec3 vb;varying float ve;void main(){
#include <clipping_planes_fragment>
if(ve<.5)discard;float wood=step(1.5,vk)*step(vk,2.5);float coverage=wood*min(.995,va*alphaPreFactor*pow(max(0.0,vb.x*vb.y*vb.z),alphaConcentration));if(coverage<.38)discard;}` : `uniform float alphaConcentration;uniform float alphaPreFactor;varying vec3 vc;varying float va;varying vec3 vb;varying float ve;void main(){
#include <clipping_planes_fragment>
if(ve<.5)discard;float coverage=min(.995,va*alphaPreFactor*pow(max(0.0,vb.x*vb.y*vb.z),alphaConcentration));if(coverage<.01)discard;gl_FragColor=vec4(vc*coverage,coverage);}`;
    return new this.THREE.ShaderMaterial({
      transparent: !t,
      colorWrite: !t,
      depthWrite: !!t,
      depthTest: !0,
      vertexColors: !t && !n,
      premultipliedAlpha: !t,
      side: this.THREE.DoubleSide,
      uniforms: {
        alphaConcentration: { value: Number(e.alphaConcentration) || 1.5 },
        alphaPreFactor: { value: Number(e.alphaPreFactor) || Math.pow(28, 1.5) },
        splatScale: { value: Number(e.scale ?? e.positionScale) || 1 },
        splatOffset: { value: new this.THREE.Vector3(...(e.sourceOffsetYUp ?? e.positionOffset ?? [0, 0, 0])) }
      },
      vertexShader: `#include <clipping_planes_pars_vertex>\n${a}\n#include <clipping_planes_vertex>\n}`,
      fragmentShader: `#include <clipping_planes_pars_fragment>\n${i}`
    });
  }
  _legacyGeometry(e) {
    const { positions: t, colors: n, alpha: a, kinds: i } = e, r = a.length, l = new Uint8Array(r * 9), o = new Uint8Array(r * 3), c = new Uint8Array(r * 9), d = new Uint8Array(r * 3);
    for (let u = 0; u < r; u++) for (let h = 0; h < 3; h++) {
      const f = u * 9 + h * 3;
      l[f] = n[u * 3], l[f + 1] = n[u * 3 + 1], l[f + 2] = n[u * 3 + 2], o[u * 3 + h] = a[u], c[f + h] = 255, d[u * 3 + h] = i[u];
    }
    const u = new this.THREE.BufferGeometry();
    return u.setAttribute("position", new this.THREE.BufferAttribute(t, 3)), u.setAttribute("color", new this.THREE.BufferAttribute(l, 3, !0)), u.setAttribute("alpha", new this.THREE.BufferAttribute(o, 1, !0)), u.setAttribute("barycentric", new this.THREE.BufferAttribute(c, 3, !0)), u.setAttribute("kind", new this.THREE.BufferAttribute(d, 1)), u.userData.splatTriangleCount = r, u;
  }
  _packedGeometry(e) {
    const { positions: t, colors: n, alpha: a, kinds: i } = e, r = a.length, l = new this.THREE.InstancedBufferGeometry();
    l.setAttribute("position", new this.THREE.Float32BufferAttribute([0, 0, 0, 1, 0, 0, 2, 0, 0], 3));
    const o = new this.THREE.InstancedInterleavedBuffer(t, 9, 1);
    l.setAttribute("splatPosition0", new this.THREE.InterleavedBufferAttribute(o, 3, 0)), l.setAttribute("splatPosition1", new this.THREE.InterleavedBufferAttribute(o, 3, 3)), l.setAttribute("splatPosition2", new this.THREE.InterleavedBufferAttribute(o, 3, 6)), l.setAttribute("splatColor", new this.THREE.InstancedBufferAttribute(n, 3, !0)), l.setAttribute("splatAlpha", new this.THREE.InstancedBufferAttribute(a, 1, !0)), l.setAttribute("splatKind", new this.THREE.InstancedBufferAttribute(i, 1));
    const c = new Uint8Array(r);
    c.fill(1), l.setAttribute("splatEnabled", new this.THREE.InstancedBufferAttribute(c, 1)), l.instanceCount = r, l.userData.packedSplats = !0, l.userData.splatTriangleCount = r, l.userData.positionScale = Number(e.positionScale), l.userData.positionOffset = [...e.positionOffset];
    const m = l.userData.positionScale, v = l.userData.positionOffset;
    const d = new this.THREE.Vector3(1 / 0, 1 / 0, 1 / 0), u = new this.THREE.Vector3(-1 / 0, -1 / 0, -1 / 0);
    for (let h = 0; h < t.length; h += 3) {
      const f = Math.fround(t[h] * m + v[0]), p = Math.fround(t[h + 1] * m + v[1]), y = Math.fround(t[h + 2] * m + v[2]);
      d.x = Math.min(d.x, f), d.y = Math.min(d.y, p), d.z = Math.min(d.z, y), u.x = Math.max(u.x, f), u.y = Math.max(u.y, p), u.z = Math.max(u.z, y);
    }
    l.boundingBox = new this.THREE.Box3(d, u);
    const h = d.clone().add(u).multiplyScalar(0.5);
    let f = 0;
    for (let p = 0; p < t.length; p += 3) f = Math.max(f, h.distanceToSquared({ x: Math.fround(t[p] * m + v[0]), y: Math.fround(t[p + 1] * m + v[1]), z: Math.fround(t[p + 2] * m + v[2]) }));
    return l.boundingSphere = new this.THREE.Sphere(h, Math.sqrt(f)), l;
  }
  setCutouts(e) {
    this.activeOverlays = [...e].slice(0, ct);
    for (const t of this.companions) this.applyCompanionCutouts(t);
  }
  setOceanPlane(e) {
    if (!(!Array.isArray(e) || e.length !== 3 || !e.every(Number.isFinite) || this.oceanPlane && e.every((n, a) => Math.abs(n - this.oceanPlane[a]) < 1e-7))) {
      this.oceanPlane = [...e];
      for (const n of this.companions) this.applyCompanionCutouts(n);
    }
  }
  applyCompanionCutouts(e) {
    const t = Sl(
      this.activeOverlays,
      e.userData.sourceRecordId
    ), n = e.geometry, a = n?.getAttribute?.("position"), i = !!n?.userData?.packedSplats, r = i ? n.getAttribute("splatPosition0") : null, l = i ? n.getAttribute("splatPosition1") : null, o = i ? n.getAttribute("splatPosition2") : null, c = i ? n.getAttribute("splatEnabled") : null;
    if (i ? !r || !l || !o || !c : !a || a.count % 3 !== 0) return;
    const d = e.userData.oceanSurfaceY, u = Number.isFinite(d) || e.userData.splatOnly;
    if (!t.length && !u) {
      if (i) {
        let h = !1;
        for (let f = 0; f < c.count; f++) c.getX(f) !== 1 && (c.setX(f, 1), h = !0);
        h && (c.needsUpdate = !0);
      } else n.setIndex(null);
      e.userData.cutoutTriangleCount = 0, e.userData.oceanFilteredTriangleCount = 0;
      return;
    }
    const h = [], f = [0, 0, 0], p = [0, 0, 0], y = [0, 0, 0];
    let g = 0, b = 0, x = !1;
    const m = i ? r.count : a.count / 3, v = Number(n.userData.positionScale) || 1, w = n.userData.positionOffset ?? [0, 0, 0], T = (M, S, R) => Math.fround((S === 0 ? M.getX(R) : S === 1 ? M.getY(R) : M.getZ(R)) * v + w[S]);
    for (let M = 0; M < m; M++) {
      const S = i ? M : M * 3;
      f[0] = i ? T(r, 0, M) : a.getX(S), f[1] = i ? T(r, 1, M) : a.getY(S), f[2] = i ? T(r, 2, M) : a.getZ(S), p[0] = i ? T(l, 0, M) : a.getX(S + 1), p[1] = i ? T(l, 1, M) : a.getY(S + 1), p[2] = i ? T(l, 2, M) : a.getZ(S + 1), y[0] = i ? T(o, 0, M) : a.getX(S + 2), y[1] = i ? T(o, 1, M) : a.getY(S + 2), y[2] = i ? T(o, 2, M) : a.getZ(S + 2);
      const R = (f[0] + p[0] + y[0]) / 3, E = (f[2] + p[2] + y[2]) / 3, O = this.oceanPlane ? this.oceanPlane[0] * R + this.oceanPlane[1] * E + this.oceanPlane[2] : d, I = Math.max(
        Math.hypot(f[0] - p[0], f[1] - p[1], f[2] - p[2]),
        Math.hypot(p[0] - y[0], p[1] - y[1], p[2] - y[2]),
        Math.hypot(y[0] - f[0], y[1] - f[1], y[2] - f[2])
      );
      let A = !0;
      u && (El(O, f, p, y) || Number.isFinite(O) && I > 3 && (f[1] + p[1] + y[1]) / 3 <= O + 12) ? (b++, A = !1) : t.some((F) => Rl(F.spec, f, p, y)) ? (g++, A = !1) : i || h.push(S, S + 1, S + 2), i && c.getX(M) !== Number(A) && (c.setX(M, Number(A)), x = !0);
    }
    i ? x && (c.needsUpdate = !0) : n.setIndex(h), e.userData.cutoutTriangleCount = g, e.userData.oceanFilteredTriangleCount = b;
  }
  async load(e, t) {
    const n = await this.fetchImpl(e.sourceUri, { signal: t, cache: "force-cache" });
    if (!n.ok) throw new Error(`${e.sourceUri}: HTTP ${n.status}`);
    let a;
    if (n.body && typeof DecompressionStream < "u")
      a = await new Response(n.body.pipeThrough(new DecompressionStream("gzip"))).arrayBuffer();
    else
      throw new Error("Streaming gzip is required for Apple splat companions");
    Ze(t);
    const sourceBytes = a.byteLength, i = await this.#l(a, e, t), { leafCount: r, woodCount: l, treeCount: o, sourceKindsTrusted: c } = i;
    Ze(t);
    const d = this.packedSplats ? this._packedGeometry(i) : this._legacyGeometry(i), u = this._createMaterial(e, !1), h = new this.THREE.Mesh(d, u), f = i.alpha.length, p = f * 60, y = this.packedSplats ? f * 24 + 36 : p;
    this.byteStats.source += sourceBytes, this.byteStats.decoded += y, this.byteStats.gpu += y, this.byteStats.legacyEquivalent += p, h.userData.convertedSessionOwned = !0, h.userData.classifiedLeafSplats = r, h.userData.classifiedWoodSplats = l, h.userData.classifiedTrees = o, h.userData.sourceKindsTrusted = c, h.userData.splatStorage = this.packedSplats ? "instanced-v1" : "legacy", h.userData.splatTriangleCount = f, h.userData.splatSourceBytes = sourceBytes, h.userData.splatBytes = y, h.userData.splatLegacyEquivalentBytes = p, h.userData.legacySplatMaterial = this.packedSplats ? this._createMaterial(e, !1, !1) : null, h.renderOrder = 7, h.visible = !1;
    const g = Number(e.sourceZoom) === 20 && l > 0 ? this._createMaterial(e, !0) : null;
    if (g) {
      const x = new this.THREE.Mesh(d, g);
      x.renderOrder = 6.5, x.visible = !1, x.userData.splatDepth = !0, h.userData.depthMesh = x;
    }
    return h;
  }
  attach(e, t) {
    e.companion = t, t.userData.sourceRecordId = e.id, t.userData.oceanSurfaceY = e.oceanSurfaceY, t.userData.splatOnly = e.splatOnly, e.companionDepth = t.userData.depthMesh ?? null, this.companions.add(t), this.applyCompanionCutouts(t), e.companionDepth && this.group.add(e.companionDepth), this.group.add(t);
  }
  dispose(e) {
    this.companions.delete(e);
    const t = e?.userData?.depthMesh;
    t?.removeFromParent?.(), t?.material?.dispose?.(), e?.userData?.legacySplatMaterial?.dispose?.(), this.byteStats.source = Math.max(0, this.byteStats.source - Number(e?.userData?.splatSourceBytes || 0)), this.byteStats.decoded = Math.max(0, this.byteStats.decoded - Number(e?.userData?.splatBytes || 0)), this.byteStats.gpu = Math.max(0, this.byteStats.gpu - Number(e?.userData?.splatBytes || 0)), this.byteStats.legacyEquivalent = Math.max(0, this.byteStats.legacyEquivalent - Number(e?.userData?.splatLegacyEquivalentBytes || 0)), ve(e);
  }
  disposeService() {
    for (const e of this.decodeJobs.values())
      e.cancelled || (e.cancelled = !0, e.signal?.removeEventListener("abort", e.onAbort), e.reject(de("Splat companion service disposed")));
    this.decodeJobs.clear(), this.decodeQueue.length = 0;
    for (const e of this.decodeWorkers) e.worker.terminate();
    this.decodeWorkers.length = 0, this.decodeWorkerUrl && globalThis.URL.revokeObjectURL(this.decodeWorkerUrl), this.decodeWorkerUrl = null;
  }
}
class kl {
  constructor({
    THREE: e = K,
    scene: t,
    camera: n,
    renderer: a,
    urls: i = Ln,
    fetchImpl: r = globalThis.fetch?.bind(globalThis),
    TilesRendererClass: l = qr,
    createLayer: o = null,
    companionService: c = null,
    logicalBoundsForId: d = ol,
    now: u = () => performance.now(),
    debugHideSplats: h = !1,
    debugHideSparseSplats: f = !1,
    debugHideCoarseSplats: p = !1,
    debugHideOceanBackings: y = !1,
    debugHideOceanSources: g = !1,
    surfaceHoleFallback: b = !0,
    resourceProfile: x = "full"
  } = {}) {
    if (!t || !n || !a) throw new TypeError("ConvertedWorldSession requires {scene,camera,renderer}");
    if (!r) throw new TypeError("ConvertedWorldSession requires fetch");
    if (String(e.REVISION) !== String(K.REVISION))
      throw new Error(`Three.js revision mismatch: host ${e.REVISION}, converted ${K.REVISION}`);
    this.resourceProfile = x === "constrained" ? "constrained" : "full";
    this.THREE = e, this.scene = t, this.camera = n, this.traversalCamera = n.clone(), this.traversalCamera.name = "apple-r3d-converted-traversal-camera", this.renderer = a, this.renderer.localClippingEnabled = !0, this.urls = { ...Ln, ...i }, this.fetchImpl = r, this.TilesRendererClass = l, this.createLayer = o, this.logicalBoundsForId = d, this.now = u, this.debugHideSplats = !!h, this.debugHideSparseSplats = !!f, this.debugHideCoarseSplats = !!p, this.debugHideOceanBackings = !!y, this.debugHideOceanSources = !!g, this.surfaceHoleFallback = !!b, this.root = new e.Group(), this.root.name = "apple-r3d-converted-world-session", this.modelsGroup = new e.Group(), this.modelsGroup.rotation.x = -Math.PI / 2, this.modelsGroup.updateMatrixWorld(!0), this.companionsGroup = new e.Group(), this.root.add(this.modelsGroup, this.companionsGroup), this.layers = /* @__PURE__ */ new Map(), this.models = /* @__PURE__ */ new Map(), this.modelsByZoom = new Map(_n.map((x) => [x, /* @__PURE__ */ new Set()])), this.splatModels = /* @__PURE__ */ new Set(), this.byTile = /* @__PURE__ */ new WeakMap(), this.stagedContentTiles = /* @__PURE__ */ new Map(), this.indexedZooms = /* @__PURE__ */ new Set(), this.z20RegionTiles = /* @__PURE__ */ new Map(), this.z20ParentResidentCounts = /* @__PURE__ */ new Map(), this.transitionExpectedCache = /* @__PURE__ */ new Map(), this.transitionReadyCounts = /* @__PURE__ */ new Map(), this.demandContentPriorities = /* @__PURE__ */ new Map(), this.activeDemandContentIds = /* @__PURE__ */ new Set(), this.columnEvictions = /* @__PURE__ */ new Set(), this.selected = /* @__PURE__ */ new Set(), this.detailVisibilityHistory = /* @__PURE__ */ new Map(), this.viewPosition = null, this.viewDirection = null, this.leases = /* @__PURE__ */ new Map(), this.nextLease = 1, this.lastTraversal = Object.fromEntries(_n.map((x) => [x, -1 / 0])), this.ownership = null, this.started = !1, this.startedAt = null, this.coarseTraversalRadius = 520, this.idleExpansionParentId = null, this.idleExpansionStartedAt = null, this.idleExpansionCursor = 0, this.idleExpansionLastAdvanceAt = null, this.disposed = !1, this.activePrepare = null, this.prepareFocus = null, this.lastPrepareResult = null, this.generation = 0, this.errors = [], this.focus = null, this.liveFocus = null, this.demandFocus = null, this.traversalTarget = null, this.predictiveMovementIntent = !1, this.activeDemand = null, this.forwardDemand = null, this.guardDemands = [], this.recentDemands = /* @__PURE__ */ new Map(), this.activeOwnershipPriorities = /* @__PURE__ */ new Map(), this.coarseGuardFocuses = [], this.detailGuardFocuses = [], this.showcaseFocuses = [], this.detailFocusMode = !1, this.roadFocusMode = !1, this.detailFocusRadius = Fo, this.detailFocusDirection = { x: 0, z: -1 }, this.detailSuppressed = !1, this.detailSuppressionReason = null, this.altitudeAboveGround = 0, this.horizontalSpeed = 0, this.locomotion = "walk", this.progressTelemetry = {
      lastPosition: null,
      lastMovedAt: null,
      blockedSince: null,
      blockedProgressMs: 0,
      maxBlockedProgressMs: 0,
      detailStarvationSince: null,
      detailStarvationMs: 0,
      maxDetailStarvationMs: 0
    }, this.expectedCancelledTiles = /* @__PURE__ */ new WeakSet(), this.replacementSelectionSignature = "", this.metrics = {
      loads: 0,
      disposals: 0,
      cancelled: 0,
      handoffs: 0,
      lateAttachRejects: 0,
      replacementRebuilds: 0,
      replacementClassificationBuilds: 0,
      replacementClassificationHits: 0,
      replacementGeometryMs: 0,
      verticalIndexBuilds: 0,
      verticalIndexHits: 0,
      verticalIndexBuildMs: 0,
      shortRayIndexHits: 0,
      textureRetries: 0,
      textureFailures: 0,
      embeddedTextureDecodes: 0,
      embeddedTextureRetries: 0,
      embeddedTextureFailures: 0,
      embeddedTextureTransportAnchors: 0,
      projectedCoverageMs: 0,
      projectedCoverageCompleted: 0,
      projectedPriorityScans: 0,
      demandPriorityLookups: 0,
      transitionReadyChecks: 0,
      transitionReadyMutations: 0,
      replacementNoopSkips: 0,
    ghostTileRepairs: 0,
    columnSiblingEvictions: 0,
    requestAdmissionRejects: 0,
    requestHeadroomExpansions: 0,
    requestPipelineOutstanding: 0,
    maxRequestPipelineOutstanding: 0,
    recentDemandRequests: 0,
    nearDetailVisibilityDrops: 0,
    visibleDetailVisibilityDrops: 0,
    detailVisibilityReadds: 0,
    lastDetailVisibilityChange: null
    }, this.residentByteStats = {
      sourceIndicesReferenced: 0,
      sourceIndicesOwned: 0,
      sourceTextureBytes: 0,
      sourceTextureEntries: 0,
      sourceTexturePeakBytes: 0,
      sourceTextureEvictions: 0
    }, this.embeddedTextureTelemetry = {
      get decodes() {
        return this.owner.metrics.embeddedTextureDecodes;
      },
      set decodes(x) {
        this.owner.metrics.embeddedTextureDecodes = x;
      },
      get retries() {
        return this.owner.metrics.embeddedTextureRetries;
      },
      set retries(x) {
        this.owner.metrics.embeddedTextureRetries = x;
      },
      get failures() {
        return this.owner.metrics.embeddedTextureFailures;
      },
      set failures(x) {
        const m = this.owner.metrics.embeddedTextureFailures;
        this.owner.metrics.embeddedTextureFailures = x, this.owner.metrics.textureFailures += Math.max(0, x - m);
      },
      get transportAnchors() {
        return this.owner.metrics.embeddedTextureTransportAnchors;
      },
      set transportAnchors(x) {
        this.owner.metrics.embeddedTextureTransportAnchors = x;
      },
      trackSourceTextureBytes(texture, bytes) {
        this.owner._retainSourceTextureBytes(texture, bytes);
      },
      owner: this
    }, this.sourceTextureByteLru = /* @__PURE__ */ new Map(), this.sourceTextureByteLimit = this.resourceProfile === "constrained" ? 3 * 1024 * 1024 : 8 * 1024 * 1024, this.splats = c ?? new Fl({ THREE: e, group: this.companionsGroup, fetchImpl: r, workerCount: this.resourceProfile === "constrained" ? 1 : 2 }), this.carOverlays = /* @__PURE__ */ new Map(), this.pendingCarOverlayIds = /* @__PURE__ */ new Set(), this.preparedCarOverlays = /* @__PURE__ */ new Map(), this.texturePixels = /* @__PURE__ */ new WeakMap(), this.textureRetries = /* @__PURE__ */ new Map(), this.projectedCoverageJobs = /* @__PURE__ */ new Map(), this.updateProfile = { samples: 0, last: {}, ema: {}, max: {} }, this.raycaster = new e.Raycaster(), this.oceanUnderlay = null;
  }
  _retainSourceTextureBytes(e, t) {
    if (!e?.userData || !ArrayBuffer.isView(t) || !t.byteLength) return;
    const n = t.byteLength;
    if (this._releaseSourceTextureBytes(e), n > this.sourceTextureByteLimit) {
      e.userData.sourceTextureBytes = null, this.residentByteStats.sourceTextureEvictions++;
      return;
    }
    e.userData.sourceTextureBytes = t;
    this.sourceTextureByteLru.set(e, n), this.residentByteStats.sourceTextureBytes += n, this.residentByteStats.sourceTextureEntries = this.sourceTextureByteLru.size;
    // Encoded bytes are only a refetchable transport copy; decoded bitmap
    // pixels remain resident, so eviction cannot change rendering or sampling.
    for (; this.residentByteStats.sourceTextureBytes > this.sourceTextureByteLimit && this.sourceTextureByteLru.size; ) {
      const a = this.sourceTextureByteLru.keys().next().value;
      this._releaseSourceTextureBytes(a, !0);
    }
    this.residentByteStats.sourceTexturePeakBytes = Math.max(this.residentByteStats.sourceTexturePeakBytes, this.residentByteStats.sourceTextureBytes);
  }
  _releaseSourceTextureBytes(e, t = !1) {
    const n = this.sourceTextureByteLru.get(e);
    if (n == null) return;
    this.sourceTextureByteLru.delete(e), e?.userData && (e.userData.sourceTextureBytes = null), this.residentByteStats.sourceTextureBytes = Math.max(0, this.residentByteStats.sourceTextureBytes - n), this.residentByteStats.sourceTextureEntries = this.sourceTextureByteLru.size, t && this.residentByteStats.sourceTextureEvictions++;
  }
  async start() {
    if (this.#t(), this.started) return this;
    if (this.scene.userData?.[it] && this.scene.userData[it] !== this)
      throw new Error("Scene already has an Apple R3D terrain owner");
    const e = this.urls.ownership, t = e.replace(/\.json(?=([?#]|$))/, ".bin");
    this.ownership = null, this.ownershipEncoding = null;
    if (t !== e)
      try {
        const n = await this.fetchImpl(t, { cache: "no-store" });
        n.ok && (this.ownership = parseOwnershipBinary(await n.arrayBuffer()), this.ownershipEncoding = "binary-v1");
      } catch {
      }
    if (!this.ownership) {
      const n = await this.fetchImpl(e, { cache: "no-store" });
      if (!n.ok) throw new Error(`ownership: HTTP ${n.status}`);
      this.ownership = await n.json(), this.ownershipEncoding = "json";
    }
    if (!Ro(this.ownership.schema))
      throw new Error(`Unsupported layered ownership schema: ${String(this.ownership.schema ?? "missing")}`);
    this.scene.add(this.root), this.scene.userData[it] = this;
    for (const n of _n) this.#l(n);
    return this.startedAt = this.now(), this.started = !0, this;
  }
  update(e = {}) {
    this.#t();
    const t = {};
    let n = performance.now();
    const a = (m) => {
      const v = performance.now();
      t[m] = v - n, n = v;
    }, i = e.now ?? this.now(), r = e.priority ?? e.player?.position, l = e.predictive?.position;
    this.traversalTarget = l && Number.isFinite(l.x) && Number.isFinite(l.z) ? { x: l.x, y: l.y ?? r?.y ?? 0, z: l.z } : null, this.predictiveMovementIntent = !!e.predictive?.movingIntent;
    const o = (m) => (Array.isArray(m) ? m : []).filter((v) => Number.isFinite(v?.x) && Number.isFinite(v?.z)).map((v) => ({
      x: v.x,
      y: v.y ?? r?.y ?? 0,
      z: v.z
    }));
    this.detailFocusMode = !!(e.detailFocusMode ?? e.predictive?.detailFocusMode), this.roadFocusMode = !!e.roadFocusMode, this.showcaseFocuses = o(e.showcaseFocuses ?? e.predictive?.showcaseFocuses).slice(0, Co), this.showcaseMode = this.showcaseFocuses.length > 0;
    const c = Number(e.detailFocusRadius ?? e.predictive?.detailFocusRadius);
    Number.isFinite(c) && (this.detailFocusRadius = Math.min(
      Oo,
      Math.max(ko, c)
    ));
    const d = e.predictive?.detailFocusDirection ?? e.predictive?.direction, u = Math.hypot(d?.x ?? 0, d?.z ?? 0);
    if (u > 1e-4 && (this.detailFocusDirection = {
      x: d.x / u,
      z: d.z / u
    }), this.coarseGuardFocuses = o(e.predictive?.coarsePositions).slice(0, No), r && Number.isFinite(r.x) && Number.isFinite(r.z)) {
      this.liveFocus = { x: r.x, y: r.y ?? 0, z: r.z };
      const m = this.detailFocusMode ? null : e.predictive?.detailPosition;
      this.demandFocus = m && Number.isFinite(m.x) && Number.isFinite(m.z) ? { x: m.x, y: m.y ?? r.y ?? 0, z: m.z } : { x: r.x, y: r.y ?? 0, z: r.z };
    }
    const viewPosition = e.camera?.position, viewDirection = e.camera?.direction, viewLength = Math.hypot(viewDirection?.x ?? 0, viewDirection?.z ?? 0);
    Number.isFinite(viewPosition?.x) && Number.isFinite(viewPosition?.z) && (this.viewPosition = { x: viewPosition.x, z: viewPosition.z }), viewLength > 1e-4 && (this.viewDirection = { x: viewDirection.x / viewLength, z: viewDirection.z / viewLength });
    const h = e.player?.velocity, f = h ? Math.hypot(h.x ?? 0, h.z ?? 0) : 0;
    this.horizontalSpeed = f, this.locomotion = e.locomotion ?? this.locomotion, this.#S(i, e.player?.position ?? r, !!e.predictive?.position);
    const p = this.showcaseMode ? ds : this.roadFocusMode ? fs : this.detailFocusMode ? us : cs;
    this.detailGuardFocuses = f < 18 ? o(e.predictive?.detailPositions).slice(0, p) : o(e.predictive?.detailRoutePositions).slice(0, p), Number.isFinite(e.altitudeAboveGround) && (this.altitudeAboveGround = Math.max(0, e.altitudeAboveGround));
    // Never remove already-rendered exact detail because the player crosses a
    // speed or altitude threshold. That policy made whole z20 transitions
    // disappear during flight and reappear on deceleration. Missing future
    // detail can still use the complete coarse fallback, but loaded detail is
    // stable until ordinary distance/capacity eviction takes over.
    this.detailSuppressed = !1, this.detailSuppressionReason = null;
    const b = this.layers.get(20), x = f < 8 && (!Number.isFinite(e.dt) || e.dt < 0.025), A = this.resourceProfile === "constrained" && !this.detailFocusMode, criticalDetailIncomplete = [this.activeDemand, this.forwardDemand].some((m) => m && !this.#re(m.parentId)), constrainedTravelMaxBytes = criticalDetailIncomplete && (this.locomotion === "flight" || this.locomotion === "glider" || f >= 35) ? 36e7 : 24e7, normalDetailMaxBytes = this.roadFocusMode ? 9e8 : criticalDetailIncomplete && !A ? 85e7 : Xn;
    b && (b.lruCache && (b.lruCache.minBytesSize = this.showcaseMode ? Qo : this.detailFocusMode ? Wo : A ? 14e7 : Vn, b.lruCache.maxBytesSize = this.showcaseMode ? Jo : this.detailFocusMode ? Ko : A ? constrainedTravelMaxBytes : normalDetailMaxBytes, b.lruCache.minSize = this.showcaseMode || this.detailFocusMode ? 800 : A ? 80 : 180, b.lruCache.maxSize = this.showcaseMode ? $o : this.detailFocusMode ? Yo : A ? 420 : 900), b.downloadQueue && (b.downloadQueue.maxJobs = this.showcaseMode ? 64 : this.roadFocusMode ? 24 : this.detailFocusMode ? 32 : A ? 6 : x ? 12 : 16), b.parseQueue && (b.parseQueue.maxJobs = this.showcaseMode ? 20 : this.roadFocusMode ? 12 : this.detailFocusMode ? 10 : A ? 2 : x ? 6 : 4), b.processNodeQueue && (b.processNodeQueue.maxJobs = this.showcaseMode ? 20 : this.roadFocusMode || this.detailFocusMode ? 10 : A ? 2 : x ? 6 : 4)), this.#te(), a("setup"), this.detailSuppressed ? this.#E() : this.#a(), a("detailStage"), this.#A(), a("coarseStage");
    for (const m of this.selected) {
      const v = this.models.get(m);
      this.layers.get(v?.zoom)?.lruCache?.markUsed?.(v.tile);
    }
    for (const [m, v] of this.layers)
      i - this.lastTraversal[m] < Eo[m] - 0.75 || m === 20 && this.z20RegionTiles.size || this.indexedZooms.has(m) && (this.prepareFocus ? m < 20 : m === 16 || m === 17) || (v.update?.(), this.lastTraversal[m] = i);
    a("traversal"), this.#I(), a("companions"), this.#k(), a("coverage"), this.#j(i), this.#R(i), a("reconcile"), this.#H(), this.#U(), a("eviction"), this.updateProfile.samples++, this.updateProfile.last = t;
    for (const [m, v] of Object.entries(t))
      this.updateProfile.ema[m] = this.updateProfile.ema[m] == null ? v : this.updateProfile.ema[m] * 0.95 + v * 0.05, this.updateProfile.max[m] = Math.max(this.updateProfile.max[m] ?? 0, v);
  }
  async prepareAt(e, { signal: t, timeoutMs: n = 15e3, radius: a = 0 } = {}) {
    this.#t(), this.activePrepare?.abort(de("Superseded destination"));
    const i = new AbortController(), r = ++this.generation, l = () => i.abort(t.reason ?? de());
    t?.addEventListener("abort", l, { once: !0 }), t?.aborted && l(), this.activePrepare = i;
    const o = this.now();
    this.focus = { ...e, radius: a }, this.demandFocus = { ...e }, this.prepareFocus = { ...e };
    try {
      for (; this.now() - o < n; ) {
        if (Ze(i.signal), r !== this.generation) throw de("Superseded destination");
        this.update({ priority: e });
        const u = this.readinessAt(e.x, e.z, a), h = u.coverageReady ? { x: e.x, z: e.z } : a > 0 && this.selected.size ? this.#G(e.x, e.z, Math.min(40, a)) : null;
        if (h) {
          const f = {
            position: e,
            readiness: { ...u, nearbyCoverage: h },
            version: zn
          };
          return this.lastPrepareResult = f, f;
        }
        await Zn(16, i.signal);
      }
      const c = {
        residentModels: this.models.size,
        queues: Object.fromEntries([...this.layers].map(([u, h]) => [u, {
          queued: h.stats?.queued ?? h.downloadQueue?.items?.length ?? 0,
          downloading: h.stats?.downloading ?? h.downloadQueue?.currJobs ?? 0,
          parsing: h.stats?.parsing ?? h.parseQueue?.currJobs ?? 0,
          loaded: h.stats?.loaded ?? 0,
          downloadPending: h.downloadQueue?.items?.length ?? 0,
          parsePending: h.parseQueue?.items?.length ?? 0,
          processPending: h.processNodeQueue?.items?.length ?? 0
        }])),
        errors: [...this.errors]
      }, d = new Error(
        `Converted coverage timed out at ${e.x},${e.z}: ${JSON.stringify(c)}`
      );
      throw d.code = "CONVERTED_PREPARE_TIMEOUT", d.diagnostics = c, d;
    } catch (c) {
      throw c.name === "AbortError" && this.metrics.cancelled++, c;
    } finally {
      t?.removeEventListener("abort", l), this.activePrepare === i && (this.activePrepare = null), this.activePrepare === null && (this.prepareFocus = null);
    }
  }
  async resetAt(e, t) {
    this.#t(), this.activePrepare?.abort(de("World reset")), ++this.generation;
    for (const n of this.layers.values()) n.resetFailedTiles?.();
    return this.prepareAt(e, { signal: t, timeoutMs: 2e4 });
  }
  surfaceAt(e, t, n = {}) {
    this.#t();
    const a = this.#f(e, t, n.top ?? 1e4);
    return a || this.#n(e, t, n);
  }
  #n(e, t, n = {}) {
    const a = n.top ?? 1e4;
    return this.raycaster.set(new this.THREE.Vector3(e, a, t), new this.THREE.Vector3(0, -1, 0)), this.raycaster.near = 0, this.raycaster.far = n.maxDistance ?? 2e4, this.#T(this.raycaster, { x: e, z: t });
  }
  raycast(e, t = {}) {
    if (this.#t(), !e?.origin || !e?.direction) return null;
    this.raycaster.set(
      new this.THREE.Vector3(e.origin.x, e.origin.y, e.origin.z),
      new this.THREE.Vector3(e.direction.x, e.direction.y, e.direction.z).normalize()
    ), this.raycaster.near = t.near ?? e.near ?? 0, this.raycaster.far = t.far ?? e.far ?? 1 / 0;
    const n = this.#Y(this.raycaster.ray.origin, this.raycaster.ray.direction, this.raycaster.near, this.raycaster.far), a = this.#T(this.raycaster);
    return n && (this.raycaster.ray.direction.y < -0.5 || !a || n.distance <= a.distance) ? n : a;
  }
  /**
   * Resolves and extracts audited source triangles without mutating a shared
   * loader geometry. The returned root is detached and invisible until the
   * caller supplies the road patch to commitSourceCarOverlay().
   */
  async prepareSourceCar(e, { signal: t, timeoutMs: n = 2e4, haloMeters: a = 8 } = {}) {
    if (this.#t(), !e?.id || !Array.isArray(e.center) || !e.removalMask?.polygonXZ)
      throw new TypeError("Source car requires id, center, and a removal polygon");
    if (this.carOverlays.has(e.id) || this.pendingCarOverlayIds.has(e.id))
      throw new Error(`Source car ${e.id} is already prepared or committed`);
    if (this.carOverlays.size + this.pendingCarOverlayIds.size >= ct)
      throw new Error(`Source car cutout capacity ${ct} reached`);
    this.pendingCarOverlayIds.add(e.id);
    const i = e.visualTemplateSpec ?? e, r = gs(i.triangleRefs), l = gs(
      i.removalTriangleRefs?.length ? i.removalTriangleRefs : i.triangleRefs
    ), o = gs(e.removalTriangleRefs?.length ? e.removalTriangleRefs : e.triangleRefs), c = [...new Set([...r, ...l, ...o].map((u) => u.sourceTileKey))];
    let d = null;
    try {
      await this.#q(c, e.center, { signal: t, timeoutMs: n }), Ze(t), d = this.#X(c, e.center, a);
      const u = r.map((m) => this.#h(m)), h = l.map((m) => this.#h(m)), f = o.map((m) => this.#h(m));
      if (u.some((m) => !m) || h.some((m) => !m) || f.some((m) => !m))
        throw new Error(`Stable source triangle mapping is incomplete for ${e.id}`);
      const p = [], y = new this.THREE.Vector3();
      for (const m of f) {
        const v = this.models.get(m.contentId), w = v?.meshes[m.primitiveIndex], T = v?.sourceIndices[m.primitiveIndex], M = w?.geometry?.attributes?.position, S = m.triangleIndex * 3;
        if (!(!w || !T || !M || S + 2 >= T.length)) {
          w.updateWorldMatrix(!0, !1);
          for (let R = 0; R < 3; R++)
            y.fromBufferAttribute(M, T[S + R]).applyMatrix4(w.matrixWorld), p.push([y.x, y.z]);
        }
      }
      const g = yl(p, 0.18);
      g.length >= 3 && (e.roadPatchPolygonXZ = g);
      let b = null;
      if (!i.proxy) {
        if (b = this.#Z(i, u, h), b.userData.sourceSplatTriangles = 0, this.#W(b, e, i), this.#K(b), !b.children.length) throw new Error(`No road-separated source triangles for ${e.id}`);
        b.userData.source = e.id, b.userData.visualTemplateSource = i.id ?? e.id;
      }
      const x = {
        id: e.id,
        spec: e,
        root: b,
        sourceIds: c,
        triangleRefs: u,
        removalRefs: f,
        sourceMappingVersion: rt,
        templateReady: !!(b || i.proxy),
        sourceLease: d
      };
      return this.preparedCarOverlays.set(e.id, x), x;
    } catch (u) {
      throw d?.release(), this.pendingCarOverlayIds.delete(e.id), this.preparedCarOverlays.delete(e.id), u;
    }
  }
  /** Cancels an extracted-but-uncommitted overlay and releases owned resources. */
  cancelPreparedSourceCar(e) {
    const t = typeof e == "string" ? e : e?.id;
    if (!t || !this.pendingCarOverlayIds.has(t)) return !1;
    const n = this.preparedCarOverlays.get(t);
    return this.preparedCarOverlays.delete(t), this.pendingCarOverlayIds.delete(t), n?.root && ve(n.root), n?.sourceLease?.release(), !0;
  }
  /** Commits source suppression, splat cutout, query patch, and car atomically. */
  commitSourceCarOverlay(e, { root: t = e?.root, patch: n } = {}) {
    if (this.#t(), !e?.id || !this.pendingCarOverlayIds.has(e.id) || this.preparedCarOverlays.get(e.id) !== e || this.carOverlays.has(e.id))
      throw new Error("Source car commit requires a unique prepared transaction");
    if (!t || !n) throw new Error("Source car commit requires a ready car root and road patch");
    const a = {
      id: e.id,
      spec: e.spec,
      root: t,
      patch: n,
      sourceIds: e.sourceIds,
      triangleRefs: e.triangleRefs,
      removalRefs: e.removalRefs,
      sourceMappingVersion: e.sourceMappingVersion,
      mappingVersion: e.sourceMappingVersion,
      refsResolved: !0,
      templateReady: e.templateReady === !0,
      committed: !1,
      suppressionApplied: !1,
      splatCutoutActive: !1,
      patchAttached: !1,
      patchQueryable: !1
    };
    t.visible = !1, n.visible = !1, t.traverse((i) => {
      i.userData.convertedSessionOwned = !0;
    }), n.traverse((i) => {
      i.userData.convertedSessionOwned = !0;
    }), this.root.add(t, n), a.patchAttached = !0, this.carOverlays.set(a.id, a);
    try {
      for (const r of a.sourceIds) {
        const l = this.models.get(r);
        l && this.#r(l);
      }
      if (a.suppressionApplied = a.removalRefs.length === 0 || a.removalRefs.every((r) => this.models.get(r.contentId)?.suppressedTriangleCount > 0), !a.suppressionApplied) throw new Error(`Source suppression did not apply for ${a.id}`);
      if (this.splats.setCutouts?.(this.carOverlays.values()), a.splatCutoutActive = !0, n.visible = !0, a.patchQueryable = !!this.#f(e.spec.center[0], e.spec.center[2], 1 / 0), !a.patchQueryable) throw new Error(`Road patch is not queryable for ${a.id}`);
      t.visible = !0, a.committed = !0, this.pendingCarOverlayIds.delete(a.id), this.preparedCarOverlays.delete(a.id), e.sourceLease?.release();
      let i = !1;
      return a.rollback = () => {
        i || (i = !0, this.removeSourceCarOverlay(a.id));
      }, a;
    } catch (i) {
      this.carOverlays.delete(a.id), this.pendingCarOverlayIds.delete(a.id), this.preparedCarOverlays.delete(a.id), e.sourceLease?.release(), this.splats.setCutouts?.(this.carOverlays.values());
      for (const r of a.sourceIds) {
        const l = this.models.get(r);
        l && this.#r(l);
      }
      throw ve(t), ve(n), i;
    }
  }
  removeSourceCarOverlay(e) {
    const t = this.carOverlays.get(e);
    if (!t) return !1;
    this.carOverlays.delete(e), this.splats.setCutouts?.(this.carOverlays.values());
    for (const n of t.sourceIds) {
      const a = this.models.get(n);
      a && this.#r(a);
    }
    return ve(t.root), ve(t.patch), t.committed = !1, !0;
  }
  /** Samples exact source JPEG texels from nearby horizontal road triangles. */
  sampleSourceRoadColors(e, { exclusionPolygons: t = [], maxSamples: n = 320 } = {}) {
    if (this.#t(), typeof document > "u" || !e?.center) return [];
    const a = Math.max(e.size?.[0] ?? 4, e.size?.[2] ?? 2) * 0.72 + 3.2, i = [], r = new this.THREE.Vector3(), l = new this.THREE.Vector3(), o = new this.THREE.Vector3(), c = new this.THREE.Vector3(), d = new this.THREE.Vector3(), u = new this.THREE.Vector3();
    for (const h of this.models.values()) {
      if (h.zoom !== 20 || oe(h.id).h !== 0 || !h.bounds) continue;
      const f = Math.max(h.bounds.min.x, Math.min(h.bounds.max.x, e.center[0])), p = Math.max(h.bounds.min.z, Math.min(h.bounds.max.z, e.center[2]));
      if (!(Math.hypot(f - e.center[0], p - e.center[2]) > a))
        for (let y = 0; y < h.meshes.length; y++) {
          const g = h.meshes[y], b = g.geometry?.attributes?.position, x = g.geometry?.attributes?.uv, m = h.sourceIndices[y], w = (Array.isArray(g.material) ? g.material[0] : g.material)?.map;
          if (!b || !x || !m || !w?.image) continue;
          const T = this.#v(w);
          if (T) {
            g.updateWorldMatrix(!0, !1);
            for (let M = 0; M * 3 + 2 < m.length; M++) {
              const S = M * 3, R = m[S], E = m[S + 1], O = m[S + 2];
              r.fromBufferAttribute(b, R).applyMatrix4(g.matrixWorld), l.fromBufferAttribute(b, E).applyMatrix4(g.matrixWorld), o.fromBufferAttribute(b, O).applyMatrix4(g.matrixWorld);
              const I = (r.x + l.x + o.x) / 3, A = (r.y + l.y + o.y) / 3, F = (r.z + l.z + o.z) / 3;
              if (Math.hypot(I - e.center[0], F - e.center[2]) > a || Math.abs(A - Ae(e, I, F)) > 0.42 || t.some((Q) => ms(I, F, Q)) || (u.crossVectors(c.subVectors(l, r), d.subVectors(o, r)).normalize(), Math.abs(u.y) < 0.76)) continue;
              const k = (x.getX(R) + x.getX(E) + x.getX(O)) / 3, C = (x.getY(R) + x.getY(E) + x.getY(O)) / 3, D = Math.max(0, Math.min(T.width - 1, Math.round(k * (T.width - 1)))), L = (Math.max(0, Math.min(T.height - 1, Math.round(C * (T.height - 1)))) * T.width + D) * 4, j = T.data[L], N = T.data[L + 1], P = T.data[L + 2], V = T.data[L + 3], Z = (j + N + P) / 3, X = Math.max(j, N, P) - Math.min(j, N, P);
              if (!(V < 220 || Z < 70 || Z > 218 || X > 32 || N > j * 1.14 && N > P * 1.12) && (i.push({ x: I, z: F, r: j, g: N, b: P }), i.length >= n))
                return i;
            }
          }
        }
    }
    return i;
  }
  readinessAt(e, t, n = 0) {
    const a = this.surfaceAt(e, t), i = a ? this.models.get(a.tileId) : null, r = a?.overlayId ? this.carOverlays.get(a.overlayId) : null, o = (n > 0 ? [[e, t], [e + n, t], [e - n, t], [e, t + n], [e, t - n]] : [[e, t]]).every(([d, u]) => !!this.surfaceAt(d, u)), c = ye({ x: e, z: t }, 17), d = this.ownership?.transitions?.[c], transitionDetailReady = !!(d?.complete && d.childZoom === 20 && this.#re(c)), u = !!(d?.complete && d.childZoom === 20 && !transitionDetailReady);
    return {
      phase: a ? "visible" : this.models.size ? "decoding" : "absent",
      coverageReady: !!a,
      detailReady: !!(r?.committed || i?.zoom === 20 && i.visualReady),
      transitionDetailReady,
      transitionParentId: d?.complete && d.childZoom === 20 ? c : null,
      sourceHoleFallback: transitionDetailReady && !(r?.committed || i?.zoom === 20 && i.visualReady),
      visualReady: !!(r?.committed || a && i?.visualReady),
      areaReady: o,
      handoffPending: u,
      selectedLod: a?.sourceZoom ?? null
    };
  }
  renderedIntersectionsAt(e, t, { aboveY: n = 1e4, belowY: a = -1e3, epsilon: i = 0.08, maxHits: r = 64 } = {}) {
    this.#t();
    const l = Number(e), o = Number(t), c = Number(n), d = Number(a), u = Math.max(0, Number(i) || 0), h = Math.max(1, Math.min(256, Math.floor(Number(r) || 64)));
    if (![l, o, c, d].every(Number.isFinite) || c <= d) throw new TypeError("renderedIntersectionsAt requires finite x/z and aboveY > belowY");
    const f = [], p = c - d;
    for (const y of this.selected) {
      const g = this.models.get(y);
      if (!g?.selected || !g.scene.visible || !g.collisionEligible) continue;
      const b = g.coverageBounds ?? g.logicalBounds;
      if (!b || l < b.minX || l >= b.maxX || o < b.minZ || o >= b.maxZ) continue;
      for (const x of g.queryMeshes ?? g.meshes) {
        if (x.visible === !1) continue;
        const m = this.#w(g, x);
        if (!m || l < m.minX || l >= m.maxX || o < m.minZ || o >= m.maxZ) continue;
        const v = Math.max(0, Math.min(m.size - 1, Math.floor((l - m.minX) / (m.maxX - m.minX) * m.size))), w = Math.max(0, Math.min(m.size - 1, Math.floor((o - m.minZ) / (m.maxZ - m.minZ) * m.size)));
        for (const T of m.bins[w * m.size + v] ?? []) {
          const M = T * 9, S = m.triangles[M], R = m.triangles[M + 1], E = m.triangles[M + 2], O = m.triangles[M + 3], I = m.triangles[M + 4], A = m.triangles[M + 5], F = m.triangles[M + 6], k = m.triangles[M + 7], C = m.triangles[M + 8], D = (A - C) * (S - F) + (F - O) * (E - C);
          if (Math.abs(D) < 1e-10) continue;
          const G = ((A - C) * (l - F) + (F - O) * (o - C)) / D, L = ((C - E) * (l - F) + (S - F) * (o - C)) / D, j = 1 - G - L;
          if (G < -1e-6 || L < -1e-6 || j < -1e-6) continue;
          const N = G * R + L * I + j * k;
          if (N > c || N < d) continue;
          const P = O - S, V = I - R, Z = A - E, X = F - S, Q = k - R, U = C - E;
          let Y = V * U - Z * Q, z = Z * X - P * U, q = P * Q - V * X;
          const ee = Math.hypot(Y, z, q) || 1;
          Y /= ee, z /= ee, q /= ee;
          const J = g.meshes.indexOf(x), te = m.faceIndices[T], Ie = x.userData.convertedReplacementRenderedSourceTriangles?.[te] ?? te;
          let Ne = g.zoom === 20 ? g.oceanOnlyPage || g.oceanOnlyRefinement ? "rendered-ocean-fallback" : "rendered-z20-land" : "rendered-coarse-unmasked";
          if (g.zoom < 20) {
            const me = Number.isFinite(g.oceanSurfaceY) && Math.abs(z) >= 0.72 && Math.abs(N - g.oceanSurfaceY) <= 0.5;
            if (me) Ne = "rendered-ocean-fallback";
            else if (g.replacement?.exactZ20Data?.some((Pe) => Pe)) {
              const De = this.#N(g, x, x.userData.convertedReplacementSourceIndex, x.geometry.attributes.position), Pe = De.footprintOffsets[Ie], Be = De.footprintOffsets[Ie + 1];
              let et = Be > Pe;
              for (let ot = Pe; et && ot < Be; ot++) g.replacement.exactZ20Data[De.footprintCells[ot]] || (et = !1);
              Ne = et ? "rendered-coarse-under-z20-land" : "rendered-source-hole-fallback";
            }
          }
          f.push({
            tileId: g.id,
            zoom: g.zoom,
            depth: c - N,
            y: N,
            normalY: z,
            ocean: Ne === "rendered-ocean-fallback",
            rendered: !0,
            maskReason: Ne,
            triangle: { meshIndex: J, triangleIndex: te, sourceTriangleIndex: Ie }
          });
        }
      }
    }
    f.sort((y, g) => g.y - y.y || g.zoom - y.zoom || y.tileId.localeCompare(g.tileId));
    const y = f.slice(0, h), g = [];
    for (let b = 0; b < y.length; b++) y[b].rank = b, y[b].belowTop = y[0].y - y[b].y;
    for (let b = 0; b < y.length; b++)
      for (let x = b + 1; x < y.length; x++) {
        const m = y[b], v = y[x], w = Math.abs(m.y - v.y);
        if (w > u || m.zoom === v.zoom || Math.abs(m.normalY) < 0.72 || Math.abs(v.normalY) < 0.72) continue;
        const T = m.zoom < v.zoom ? m : v, M = m.zoom > v.zoom ? m : v;
        const S = T.maskReason === "rendered-ocean-fallback" ? M.zoom === 20 && M.maskReason === "rendered-z20-land" ? "ocean-over-authoritative-land" : "ocean-fallback" : T.maskReason === "rendered-source-hole-fallback" ? "source-hole-fallback" : "double-render";
        g.push({ upperHit: b, lowerHit: x, upperTileId: m.tileId, lowerTileId: v.tileId, separation: w, classification: S, warning: S === "double-render" || S === "ocean-over-authoritative-land" });
      }
    return {
      x: l,
      z: o,
      ray: { origin: { x: l, y: c, z: o }, direction: { x: 0, y: -1, z: 0 }, near: 0, far: p },
      hits: y,
      overlaps: g,
      warningCount: g.filter((b) => b.warning).length,
      truncated: f.length > y.length
    };
  }
  debugRecords(e = this.demandFocus?.x ?? 0, t = this.demandFocus?.z ?? 0, n = 520) {
    const a = Math.max(1, Number(n) || 520);
    return [...this.models.values()].filter((i) => {
      if (!i.bounds) return !1;
      const r = Math.max(i.bounds.min.x - e, 0, e - i.bounds.max.x), l = Math.max(i.bounds.min.z - t, 0, t - i.bounds.max.z);
      return Math.hypot(r, l) <= a;
    }).map((i) => ({
      id: i.id,
      zoom: i.zoom,
      h: oe(i.id).h,
      selected: i.selected,
      meshReady: i.meshReady,
      visualReady: i.visualReady,
      hasSplat: !!i.companion,
      visualState: i.visualReady ? "ready" : i.textureState === "retry-wait" || i.textureState === "failed" ? `texture-${i.textureState}` : i.projectedCoverageState === "building" || i.projectedCoverageState === "failed" ? `coverage-${i.projectedCoverageState}` : i.companionState,
      companionAttempts: i.companionAttempts,
      companionError: i.companionError,
      textureState: i.textureState,
      textureAttempts: i.textureAttempts,
      textureError: i.textureError,
      projectedCoverageState: i.projectedCoverageState,
      oceanSurfaceY: i.oceanSurfaceY,
      oceanOnlyPage: i.oceanOnlyPage,
      oceanOnlyRefinement: i.oceanOnlyRefinement,
      oceanClassification: i.oceanClassification,
      oceanSourceBacking: !!i.oceanBacking,
      exactZ20CoveredCells: i.replacement?.exactZ20Data?.reduce((r, l) => r + (l ? 1 : 0), 0) ?? 0,
      exactZ20SuppressedTriangles: i.exactZ20SuppressedTriangles ?? 0,
      pinCount: i.pinCount,
      bounds: {
        minX: i.bounds.min.x,
        maxX: i.bounds.max.x,
        minZ: i.bounds.min.z,
        maxZ: i.bounds.max.z
      },
      clipOwnerId: i.clipOwnerId
    }));
  }
  debugParentAudit(e = this.liveFocus?.x ?? this.demandFocus?.x ?? 0, t = this.liveFocus?.z ?? this.demandFocus?.z ?? 0) {
    const n = { x: Number(e), z: Number(t) };
    if (!Number.isFinite(n.x) || !Number.isFinite(n.z) || !this.ownership) return null;
    const a = ye(n, 17), i = this.ownership.transitions?.[a] ?? null, r = oe(a), l = i?.complete && i.childZoom === 20 ? [...i.expected] : [], o = new Set(l), c = [];
    for (let g = 0; g < 8; g++) for (let b = 0; b < 8; b++)
      c.push(`20/${r.x * 8 + g}/${r.y * 8 + b}/0`);
    const d = [...c, ...l.filter((g) => oe(g).h > 0)], u = this.now(), h = (g) => {
      const b = this.logicalBoundsForId(g), x = (b.minX + b.maxX) * 0.5, m = (b.minZ + b.maxZ) * 0.5;
      return [...this.selected].map((v) => this.models.get(v)).filter((v) => v && v.zoom < 20).filter((v) => {
        const w = v.coverageBounds ?? v.logicalBounds;
        return x >= w.minX && x < w.maxX && m >= w.minZ && m < w.maxZ;
      }).sort((v, w) => w.zoom - v.zoom)[0]?.id ?? null;
    }, f = d.map((g) => {
      const b = o.has(g), x = this.stagedContentTiles.get(g), m = this.models.get(g), v = hl(x?.tile?.internal?.loadingState), w = this.logicalBoundsForId(g), T = Te(n, w);
      let M;
      return b ? x ? m ? m.visualReady ? m.oceanOnlyRefinement ? M = "pure-ocean-refinement-parent-retained" : !m.selected && this.detailSuppressed ? M = `detail-policy-${this.detailSuppressionReason ?? "suppressed"}` : m.selected ? m.scene.visible ? M = "visible" : M = "selected-scene-hidden" : M = "ready-but-not-selected" : M = m.textureState === "retry-wait" || m.textureState === "failed" ? `texture-${m.textureState}` : m.projectedCoverageState === "building" || m.projectedCoverageState === "failed" ? `coverage-${m.projectedCoverageState}` : m.companionState : M = v === "loaded" ? "loaded-record-evicted-or-not-attached" : v : M = "authoritative-but-not-indexed" : M = "no-authoritative-z20-source", {
        id: g,
        h: oe(g).h,
        authoritative: b,
        indexed: !!x,
        requested: !!x?.requestedAt,
        loadingState: v,
        decoded: !!m?.meshReady,
        visualReady: !!m?.visualReady,
        selected: !!m?.selected,
        sceneVisible: !!m?.scene?.visible,
        renderer: x?.tile ? {
          inFrustum: x.tile.traversal?.inFrustum ?? null,
          active: x.tile.traversal?.active ?? null,
          visible: x.tile.traversal?.visible ?? null,
          used: x.tile.traversal?.used ?? null
        } : null,
        classification: m ? {
          oceanOnly: !!m.oceanOnlyPage,
          oceanOnlyRefinement: !!m.oceanOnlyRefinement,
          legacyAabb: m.oceanClassification?.legacyAabb ?? null,
          raisedArea: m.oceanClassification?.raisedArea ?? null,
          raisedAreaLimit: m.oceanClassification?.raisedAreaLimit ?? null
        } : null,
        visibilityReason: M,
        fallbackOwner: m?.selected ? null : h(g),
        distanceMeters: T,
        timeline: {
          firstRequestedAt: x?.firstRequestedAt ?? null,
          lastRequestedAt: x?.lastRequestedAt ?? null,
          loadedAt: x?.loadedAt ?? null,
          lastSelectedAt: Number.isFinite(m?.lastSelectedAt) ? m.lastSelectedAt : null,
          selectedAt: m?.selectedAt ?? null,
          hiddenAt: m?.hiddenAt ?? null,
          lastEvictedAt: x?.lastEvictedAt ?? null,
          ageSinceLoadMs: x?.loadedAt == null ? null : Math.max(0, u - x.loadedAt)
        }
      };
    }), p = f.filter((g) => g.authoritative && g.visualReady && !g.classification?.oceanOnlyRefinement && !g.sceneVisible && g.distanceMeters <= Es), y = (g) => f.filter((b) => b.visibilityReason === g).length;
    return {
      position: n,
      playerFocus: this.liveFocus ? { ...this.liveFocus } : null,
      projectedFocus: this.demandFocus ? { ...this.demandFocus } : null,
      parentId: a,
      transitionComplete: !!i?.complete,
      theoreticalGroundCells: 64,
      authoritativeGroundCells: c.filter((g) => o.has(g)).length,
      absentAuthoritativeGroundCells: c.filter((g) => !o.has(g)).length,
      authoritativeExtras: l.filter((g) => oe(g).h > 0).length,
      counts: {
        indexed: f.filter((g) => g.indexed).length,
        queued: y("queued"),
        downloading: y("downloading"),
        parsing: y("parsing"),
        decoded: f.filter((g) => g.decoded).length,
        visualReady: f.filter((g) => g.visualReady).length,
        visible: y("visible"),
        pureOceanParentRetained: y("pure-ocean-refinement-parent-retained"),
        readyButNotSelected: y("ready-but-not-selected"),
        missingSource: y("no-authoritative-z20-source")
      },
      warnings: p.map((g) => ({ id: g.id, reason: g.visibilityReason, distanceMeters: g.distanceMeters })),
      children: f
    };
  }
  pinCoverage(e, t) {
    this.#t();
    let n = this.#y(e, t);
    const a = n.length ? null : this.#f(e, t, 1e4);
    if (!n.length && a) {
      const c = this.carOverlays.get(a.overlayId)?.sourceIds.map((d) => this.models.get(d)).find((d) => d?.selected);
      if (c?.zoom === 20) {
        const d = c.transitionParentId ?? It(c.id, 17);
        n = (this.ownership.transitions?.[d]?.expected ?? [c.id]).map((h) => this.models.get(h)).filter((h) => h?.selected);
      } else c && (n = [c]);
    }
    if (!n.length) throw new Error("Cannot pin absent converted coverage");
    const i = `converted-lease-${this.nextLease++}`;
    for (const o of n) o.pinCount++;
    let r = !1;
    const l = {
      id: i,
      x: e,
      z: t,
      ownerIds: n.map((o) => o.id),
      release: () => {
        if (!r) {
          r = !0;
          for (const o of l.ownerIds) {
            const c = this.models.get(o);
            c && (c.pinCount = Math.max(0, c.pinCount - 1));
          }
          this.leases.delete(i);
        }
      },
      get released() {
        return r;
      }
    };
    return this.leases.set(i, l), l;
  }
  snapshot({ includeReadiness: e = !0, compact: n = !1 } = {}) {
    const t = [...this.selected].map((n) => this.models.get(n)).filter(Boolean);
    if (n) {
      let a = 0, i = 0, r = 0, l = 0;
      for (const o of this.models.values()) o.companion && a++, o.companionDepth && i++;
      for (const o of t) o.companion?.visible && r++, o.companionDepth?.visible && l++;
      return { backend: "3d-tiles", version: zn, resourceProfile: this.resourceProfile, ownershipEncoding: this.ownershipEncoding, selectedOwnerCount: t.length, coverage: { pins: this.leases.size }, cache: { residentModels: this.models.size, residentSplats: a, residentSplatDepths: i, selectedModels: t.length, selectedSplats: r, selectedSplatDepths: l, splatStorage: this.splats.packedSplats ? "instanced-v1" : "legacy", splatBytes: { ...this.splats.byteStats }, residentBytes: { ...this.residentByteStats, sourceTextureLimit: this.sourceTextureByteLimit } }, queues: Object.fromEntries([...this.layers].map(([o, c]) => [o, { cacheItems: c.lruCache?.itemSet?.size ?? null, cacheMaxItems: c.lruCache?.maxSize ?? null, cacheBytes: c.lruCache?.cachedBytes ?? null, cacheMaxBytes: c.lruCache?.maxBytesSize ?? null, downloadQueueItems: c.downloadQueue?.items?.length ?? null, downloadQueueActive: c.downloadQueue?.currJobs ?? null, parseQueueItems: c.parseQueue?.items?.length ?? null, parseQueueActive: c.parseQueue?.currJobs ?? null, processQueueItems: c.processNodeQueue?.items?.length ?? null, processQueueActive: c.processNodeQueue?.currJobs ?? null }])), lifecycle: { ...this.metrics }, errors: [...this.errors] };
    }
    return {
      backend: "3d-tiles",
      version: zn,
      ownershipEncoding: this.ownershipEncoding,
      migrationReady: !1,
      coverage: { owners: [...this.selected], pins: this.leases.size },
      lastPrepareResult: this.lastPrepareResult,
      selectedOwnerCount: t.length,
      cache: {
        residentModels: this.models.size,
        residentSplats: [...this.models.values()].filter((n) => n.companion).length,
        residentSplatDepths: [...this.models.values()].filter((n) => n.companionDepth).length,
        selectedModels: t.length,
        selectedSplats: t.filter((n) => n.companion?.visible).length,
        selectedSplatDepths: t.filter((n) => n.companionDepth?.visible).length,
        splatStorage: this.splats.packedSplats ? "instanced-v1" : "legacy",
        splatBytes: { ...this.splats.byteStats },
        residentBytes: { ...this.residentByteStats, sourceTextureLimit: this.sourceTextureByteLimit },
        classifiedTrees: t.reduce((n, a) => n + Number(a.companion?.userData?.classifiedTrees || 0), 0),
        classifiedWoodSplats: t.reduce((n, a) => n + Number(a.companion?.userData?.classifiedWoodSplats || 0), 0)
      },
      overlays: [...this.carOverlays.values()].map((n) => ({
        id: n.id,
        sourceMappingVersion: n.sourceMappingVersion,
        mappingVersion: n.mappingVersion,
        committed: n.committed,
        refsResolved: n.refsResolved,
        templateReady: n.templateReady,
        suppressionApplied: n.suppressionApplied,
        splatCutoutActive: n.splatCutoutActive,
        patchAttached: n.patchAttached,
        patchQueryable: n.patchQueryable,
        sourceTriangles: n.triangleRefs.length,
        removalTriangles: n.removalRefs.length
      })),
      overlayTransactions: {
        mappingVersion: rt,
        preparing: [...this.pendingCarOverlayIds].map((n) => ({
          id: n,
          sourceLeaseHeld: this.preparedCarOverlays.get(n)?.sourceLease?.released === !1
        })),
        committed: this.carOverlays.size,
        capacity: ct
      },
      queues: Object.fromEntries([...this.layers].map(([n, a]) => [n, {
        ...a.stats ?? {},
        cacheItems: a.lruCache?.itemSet?.size ?? null,
        cacheMaxItems: a.lruCache?.maxSize ?? null,
        cacheBytes: a.lruCache?.cachedBytes ?? null,
        cacheMinBytes: a.lruCache?.minBytesSize ?? null,
        cacheMaxBytes: a.lruCache?.maxBytesSize ?? null,
        cacheFull: a.lruCache?.isFull?.() ?? null,
        downloadQueueItems: a.downloadQueue?.items?.length ?? null,
        downloadQueueActive: a.downloadQueue?.currJobs ?? null,
        downloadQueueScheduled: a.downloadQueue?.scheduled ?? null,
        parseQueueItems: a.parseQueue?.items?.length ?? null,
        parseQueueActive: a.parseQueue?.currJobs ?? null,
        processQueueItems: a.processNodeQueue?.items?.length ?? null,
        processQueueActive: a.processNodeQueue?.currJobs ?? null
      }])),
      demand: this.activeDemand ? {
        parentId: this.activeDemand.parentId,
        expected: this.activeDemand.expected.length,
        indexed: this.activeDemand.expected.filter((n) => this.stagedContentTiles.has(n)).length,
        meshReady: this.activeDemand.expected.filter((n) => this.models.get(n)?.meshReady).length,
        visualReady: this.activeDemand.expected.filter((n) => this.models.get(n)?.visualReady).length,
        requested: [...this.activeDemand.requested],
        regions: [...this.activeDemand.regions],
        missingMesh: this.activeDemand.expected.filter((n) => !this.models.get(n)?.meshReady),
        missingVisual: this.activeDemand.expected.filter((n) => !this.models.get(n)?.visualReady),
        loadStates: Object.fromEntries(this.activeDemand.expected.filter((n) => !this.models.get(n)?.meshReady).map((n) => [n, this.stagedContentTiles.get(n)?.tile?.internal?.loadingState ?? null]))
      } : null,
      forwardDemand: this.forwardDemand ? {
        parentId: this.forwardDemand.parentId,
        expected: this.forwardDemand.expected.length,
        indexed: this.forwardDemand.expected.filter((n) => this.stagedContentTiles.has(n)).length,
        meshReady: this.forwardDemand.expected.filter((n) => this.models.get(n)?.meshReady).length,
        visualReady: this.forwardDemand.expected.filter((n) => this.models.get(n)?.visualReady).length,
        requested: [...this.forwardDemand.requested],
        regions: [...this.forwardDemand.regions],
        missingMesh: this.forwardDemand.expected.filter((n) => !this.models.get(n)?.meshReady),
        missingVisual: this.forwardDemand.expected.filter((n) => !this.models.get(n)?.visualReady),
        loadStates: Object.fromEntries(this.forwardDemand.expected.filter((n) => !this.models.get(n)?.meshReady).map((n) => [n, this.stagedContentTiles.get(n)?.tile?.internal?.loadingState ?? null]))
      } : null,
      guardDemands: this.guardDemands.map((n) => ({
        parentId: n.parentId,
        expected: n.expected.length,
        meshReady: n.expected.filter((a) => this.models.get(a)?.meshReady).length,
        visualReady: n.expected.filter((a) => this.models.get(a)?.visualReady).length,
        requested: n.requested.size
      })),
      recentDemands: [...this.recentDemands.values()].map(({ demand: n, expiresAt: a }) => ({
        parentId: n.parentId,
        expected: n.expected.length,
        visualReady: n.expected.filter((i) => this.models.get(i)?.visualReady).length,
        expiresInMs: Math.max(0, a - this.now())
      })),
      coverageBuild: {
        pending: this.projectedCoverageJobs.size,
        records: [...this.projectedCoverageJobs.values()].map(({ record: n }) => ({
          id: n.id,
          state: n.projectedCoverageState,
          queuedAt: n.projectedCoverageQueuedAt,
          priority: this.#c(n)
        }))
      },
      activeOwnershipPath: {
        ids: [...this.activeOwnershipPriorities.keys()],
        ready: [...this.activeOwnershipPriorities.keys()].filter((n) => this.models.get(n)?.visualReady),
        pending: [...this.activeOwnershipPriorities.keys()].filter((n) => !this.models.get(n)?.visualReady)
      },
      regression: {
        blockedProgressMs: this.progressTelemetry.blockedProgressMs,
        maxBlockedProgressMs: this.progressTelemetry.maxBlockedProgressMs,
        detailStarvationMs: this.progressTelemetry.detailStarvationMs,
        maxDetailStarvationMs: this.progressTelemetry.maxDetailStarvationMs,
        exactReadyButUnselected: this.progressTelemetry.detailStarvationSince != null
      },
      stalledVisuals: [...this.models.values()].filter((n) => n.meshReady && !n.visualReady && (["retry-wait", "failed"].includes(n.companionState) || ["retry-wait", "failed"].includes(n.textureState))).map((n) => ({
        id: n.id,
        state: ["retry-wait", "failed"].includes(n.textureState) ? `texture-${n.textureState}` : n.companionState,
        attempts: Math.max(n.textureAttempts, n.companionAttempts),
        error: n.textureError ?? n.companionError
      })),
      prediction: this.traversalTarget ? {
        traversalTarget: { ...this.traversalTarget },
        detailTarget: this.demandFocus ? { ...this.demandFocus } : null,
        coarseGuards: this.coarseGuardFocuses.map((n) => ({ ...n })),
        detailGuards: this.detailGuardFocuses.map((n) => ({ ...n }))
      } : null,
      coarsePrepare: this.prepareFocus ? Object.fromEntries([15, 16, 17].map((n) => {
        const a = ye(this.prepareFocus, n), i = this.stagedContentTiles.get(a);
        return [n, { id: a, indexed: !!i, loadingState: i?.tile?.internal?.loadingState ?? null }];
      })) : null,
      detailSuppressed: this.detailSuppressed,
      detailSuppressionReason: this.detailSuppressionReason,
      detailFocus: {
        enabled: this.detailFocusMode,
        roadProfile: this.roadFocusMode,
        showcaseProfile: this.showcaseMode,
        showcaseFocusCount: this.showcaseFocuses.length,
        radiusMeters: this.detailFocusMode ? this.detailFocusRadius : null,
        forwardMeters: this.detailFocusMode ? this.roadFocusMode ? jn : this.detailFocusRadius * 2 : null,
        hysteresisMeters: this.detailFocusMode ? hs : null,
        guardLimit: this.showcaseMode ? ds : this.roadFocusMode ? fs : this.detailFocusMode ? us : cs
      },
      loadingPolicy: {
        coarseTraversal: "player-centered-radial",
        coarseRadiusMeters: Math.round(this.coarseTraversalRadius),
        idleDetailExpansion: "disabled-until-movement",
        idleExpansionParentId: this.idleExpansionParentId,
        idleExpansionAgeMs: this.idleExpansionStartedAt == null ? null : Math.max(0, this.now() - this.idleExpansionStartedAt),
        idleExpansionRegions: this.idleExpansionCursor,
        idleExpansionCandidateActive: this.forwardDemand != null && !this.predictiveMovementIntent && this.horizontalSpeed < 0.5,
        predictiveMovementIntent: this.predictiveMovementIntent,
        forwardCorridorActive: this.forwardDemand != null && (this.predictiveMovementIntent || this.horizontalSpeed >= 0.5)
      },
      altitudeAboveGround: this.altitudeAboveGround,
      horizontalSpeed: this.horizontalSpeed,
      parentAudit: e ? this.debugParentAudit(
        (this.liveFocus ?? this.focus ?? { x: 0 }).x,
        (this.liveFocus ?? this.focus ?? { z: 0 }).z
      ) : null,
      // Snapshot readiness must describe the physical player, not a projected
      // traversal focus which may already be over a different z20 child.
      readiness: e && (this.liveFocus ?? this.focus) ? this.readinessAt(
        (this.liveFocus ?? this.focus).x,
        (this.liveFocus ?? this.focus).z,
        this.liveFocus ? 0 : this.focus.radius
      ) : null,
      lifecycle: { ...this.metrics },
      updateProfile: {
        samples: this.updateProfile.samples,
        last: { ...this.updateProfile.last },
        ema: { ...this.updateProfile.ema },
        max: { ...this.updateProfile.max }
      },
      errors: [...this.errors]
    };
  }
  dispose() {
    if (!this.disposed) {
      this.activePrepare?.abort(de("Converted session disposed"));
      for (const e of this.textureRetries.values()) e.timer != null && clearTimeout(e.timer);
      this.textureRetries.clear();
      for (const e of [...this.leases.values()]) e.release();
      for (const e of this.carOverlays.values())
        ve(e.root), ve(e.patch), e.committed = !1;
      this.carOverlays.clear();
      for (const e of this.preparedCarOverlays.values())
        e?.root && ve(e.root), e?.sourceLease?.release();
      this.preparedCarOverlays.clear(), this.pendingCarOverlayIds.clear(), this.splats.setCutouts?.([]);
      for (const e of [...this.models.values()]) this.#o(e, !0);
      for (const e of [...this.sourceTextureByteLru.keys()]) this._releaseSourceTextureBytes(e);
      this.splats.disposeService?.();
      for (const e of this.layers.values())
        e.__convertedUnsubscribe?.(), e.group?.removeFromParent?.(), e.dispose?.();
      this.layers.clear(), this.oceanUnderlay && (this.oceanUnderlay.removeFromParent(), this.oceanUnderlay.geometry?.dispose?.(), this.oceanUnderlay.material?.map?.userData?.convertedSessionOwned && this.oceanUnderlay.material.map.dispose?.(), this.oceanUnderlay.material?.dispose?.(), this.oceanUnderlay = null), this.root.removeFromParent(), this.scene.userData?.[it] === this && delete this.scene.userData[it], this.disposed = !0;
    }
  }
  #l(e) {
    const t = this.createLayer ? this.createLayer({ zoom: e, url: this.urls[e], session: this }) : new this.TilesRendererClass(this.urls[e]), n = (c, d) => {
      const u = new bt();
      return u.priorityCallback = c?.priorityCallback ?? null, u.maxJobs = d, u;
    }, a = {
      15: { download: 4, parse: 1, process: 2 },
      16: { download: 4, parse: 1, process: 2 },
      17: { download: 4, parse: 1, process: 2 },
      // Two install lanes are required to finish a measured 64-page region
      // before a ~25 m/s flight crosses it. The citywide per-frame ownership
      // scan has been removed, leaving enough main-thread budget for both.
      20: this.resourceProfile === "constrained" ? { download: 6, parse: 2, process: 2 } : { download: 16, parse: 4, process: 4 }
    }[e];
    if (t.downloadQueue = n(t.downloadQueue ?? _t, a.download), t.parseQueue = n(t.parseQueue ?? Lt, a.parse), t.processNodeQueue = n(t.processNodeQueue ?? Nt, a.process), !this.createLayer) {
      t.lruCache = new la(), t.lruCache.unloadPriorityCallback = zs.unloadPriorityCallback, t.group.rotation.x = -Math.PI / 2, t.errorTarget = e === 20 ? 12 : 1, t.loadSiblings = !1, t.loadAncestors = !0, t.displayActiveTiles = !1, t.maxTilesProcessed = e === 20 ? this.resourceProfile === "constrained" ? 48 : 128 : this.resourceProfile === "constrained" ? 32 : 64;
      const c = {
        15: this.resourceProfile === "constrained" ? [5e7, 8e7, 30, 80] : [11e7, 17e7, 80, 160],
        16: this.resourceProfile === "constrained" ? [4e7, 7e7, 30, 90] : [6e7, 1e8, 60, 140],
        17: this.resourceProfile === "constrained" ? [6e7, 1e8, 60, 150] : [8e7, 14e7, 100, 250],
        20: this.resourceProfile === "constrained" ? [14e7, 24e7, 80, 420] : [Vn, Xn, 800, 2800]
      }[e];
      t.lruCache.minBytesSize = c[0], t.lruCache.maxBytesSize = c[1], t.lruCache.minSize = c[2], t.lruCache.maxSize = c[3], t.lruCache.unloadPercent = 0.12, t.registerPlugin(new Qr({ disableMipmaps: !0, compressIndex: !0, compressPosition: !1, compressUvs: !1 })), e === 15 ? t.registerPlugin(new Mo()) : t.registerPlugin(new yo({
        meshoptDecoder: wo,
        plugins: [(d) => il(d, this.THREE, this.embeddedTextureTelemetry)]
      })), this.root.add(t.group);
    }
    t.setCamera?.(this.traversalCamera), t.setResolutionFromRenderer?.(this.traversalCamera, this.renderer);
    const i = (c) => {
      const d = this.stagedContentTiles.get(Ge(c.tile));
      d && (d.requestedAt = null, d.loadedAt = this.now()), this.#C(e, c.tile, c.scene);
    }, r = (c) => this.#s(e, c.tileset?.root, t), l = (c) => {
      const d = this.byTile.get(c.tile) ?? this.models.get(Ge(c.tile));
      d && !d.selected && d.pinCount === 0 && this.#o(d), c.scene && (c.scene.visible = !1);
    }, o = (c) => {
      c.tile && this.expectedCancelledTiles.has(c.tile) || this.errors.push(String(c.error?.message ?? c.error));
    };
    t.addEventListener?.("load-model", i), t.addEventListener?.("load-tileset", r), t.addEventListener?.("dispose-model", l), t.addEventListener?.("load-error", o), t.__convertedUnsubscribe = () => {
      t.removeEventListener?.("load-model", i), t.removeEventListener?.("load-tileset", r), t.removeEventListener?.("dispose-model", l), t.removeEventListener?.("load-error", o);
    }, this.layers.set(e, t);
  }
  #s(e, t, n = null) {
    if (!t) return;
    n && n.ensureChildrenArePreprocessed?.(t, !0);
    const a = Ge(t);
    if (a) {
      const r = this.stagedContentTiles.get(a);
      this.stagedContentTiles.set(a, {
        zoom: e,
        tile: t,
        requestedAt: r?.requestedAt ?? null,
        firstRequestedAt: r?.firstRequestedAt ?? null,
        lastRequestedAt: r?.lastRequestedAt ?? null,
        requestCount: r?.requestCount ?? 0,
        loadedAt: r?.loadedAt ?? null,
        lastEvictedAt: r?.lastEvictedAt ?? null
      }), this.indexedZooms.add(e);
    }
    const i = e === 20 ? String(t?.extras?.region ?? "") : "";
    i && this.z20RegionTiles.set(i, t);
    for (const r of t.children ?? []) this.#s(e, r, n);
  }
  #a() {
    const e = this.layers.get(20);
    if (!e || !this.ownership) return;
    const t = (A) => {
      if (!A) return null;
      for (const F of [17, 16, 15]) {
        const k = ye(A, F), C = this.ownership.transitions?.[k];
        if (C?.complete && C.childZoom === 20 && C.expected?.length <= Nn) return { parentId: k, transition: C, anchor: { x: A.x, z: A.z } };
      }
      return null;
    }, n = (A) => {
      const F = this.ownership.transitions?.[A];
      if (!(F?.complete && F.childZoom === 20 && F.expected?.length <= Nn)) return null;
      const k = this.logicalBoundsForId(A);
      return { parentId: A, transition: F, anchor: { x: (k.minX + k.maxX) * 0.5, z: (k.minZ + k.maxZ) * 0.5 } };
    }, a = (A) => {
      if (!this.detailFocusMode || !A) return [];
      const F = ye(A, 17), [, k, C] = F.split("/"), D = Number(k), G = Number(C);
      if (!Number.isFinite(D) || !Number.isFinite(G)) return [];
      const L = this.roadFocusMode ? Math.min(this.detailFocusRadius, Po) : this.detailFocusRadius, j = this.roadFocusMode ? Math.max(jn, this.detailFocusRadius * 3) : L * 2, N = Math.ceil((j + 260) / 240), P = this.detailFocusDirection, V = /* @__PURE__ */ new Map(), Z = /* @__PURE__ */ new Map(), X = (z, q = !1) => {
        const ee = n(z);
        if (!ee) return;
        const J = this.logicalBoundsForId(z), te = Te(A, J), Ie = (J.minX + J.maxX) * 0.5, Ne = (J.minZ + J.maxZ) * 0.5, me = Ie - A.x, De = Ne - A.z, Pe = me * P.x + De * P.z, Be = Math.abs(me * -P.z + De * P.x);
        te <= L || q && te <= L + hs ? V.set(z, { candidate: ee, distance: te, ahead: Pe }) : te <= j && Pe > 0 && Be <= (this.roadFocusMode ? _o : Math.max(260, L * 0.9)) && Z.set(z, { candidate: ee, distance: te, ahead: Pe, lateral: Be });
      };
      for (let z = -N; z <= N; z++)
        for (let q = -N; q <= N; q++) X(`17/${D + z}/${G + q}/0`);
      for (const z of [this.activeDemand, this.forwardDemand, ...this.guardDemands])
        z?.parentId && X(z.parentId, !0);
      const Q = [...V.values()].sort((z, q) => z.distance - q.distance || q.ahead - z.ahead).map((z) => z.candidate), U = [...Z.values()].filter((z) => !V.has(z.candidate.parentId)).sort((z, q) => z.ahead - q.ahead || z.lateral - q.lateral || z.distance - q.distance).slice(0, this.roadFocusMode ? Lo : Io).map((z) => z.candidate);
      return this.roadFocusMode ? [...U.slice(0, 1), ...Q, ...U.slice(1)] : [...Q, ...U];
    }, i = (A) => {
      if (!A) return;
      let F = 0;
      for (const k of A.requested) {
        const C = this.stagedContentTiles.get(k);
        C && C.tile.internal?.loadingState === 1 && !this.models.get(k) && e.lruCache?.has?.(C.tile) && (this.expectedCancelledTiles.add(C.tile), e.lruCache.remove(C.tile) && F++);
      }
      F && this.metrics.cancelled++;
    }, r = (A) => {
      const k = A.anchor ?? (() => {
        const C = this.logicalBoundsForId(A.parentId);
        return { x: (C.minX + C.maxX) * 0.5, z: (C.minZ + C.maxZ) * 0.5 };
      })(), F = [...A.transition.expected].sort((C, D) => Te(k, this.logicalBoundsForId(C)) - Te(k, this.logicalBoundsForId(D)) || C.localeCompare(D));
      return {
        parentId: A.parentId,
        anchor: k,
        expected: F,
        expectedSet: new Set(F),
        regions: new Set(F.map(ml).filter(Boolean)),
        requested: /* @__PURE__ */ new Set()
      };
    }, q = (A, F) => {
      const k = F?.anchor;
      if (!A || !k || A.anchor && Math.hypot(k.x - A.anchor.x, k.z - A.anchor.z) < 30) return A;
      const C = [], D = [];
      for (const G of A.expected) {
        const L = this.stagedContentTiles.get(G), j = this.models.get(G), N = L?.tile?.internal?.loadingState, P = A.requested.has(G) || j?.meshReady || N != null && N !== 0;
        (P ? C : D).push(G);
      }
      D.sort((G, L) => Te(k, this.logicalBoundsForId(G)) - Te(k, this.logicalBoundsForId(L)) || G.localeCompare(L)), A.anchor = { x: k.x, z: k.z }, A.expected = [...C, ...D];
      return A;
    }, l = this.now(), o = this.prepareFocus ?? this.liveFocus ?? this.focus ?? this.demandFocus;
    for (const [A, F] of this.recentDemands) {
      const k = l - F.retiredAt, C = o ? Te(o, this.logicalBoundsForId(A)) : 1 / 0;
      F.expiresAt > l && (k <= Vo || C <= Xo) || (this.recentDemands.delete(A), i(F.demand));
    }
    const c = () => {
      const A = this.detailFocusMode ? 0 : e.lruCache?.isFull?.() ? 1 : Ho;
      for (; this.recentDemands.size > A; ) {
        const F = [...this.recentDemands.entries()].sort((k, C) => k[1].retiredAt - C[1].retiredAt)[0];
        this.recentDemands.delete(F[0]), i(F[1].demand);
      }
    };
    c();
    const d = (A) => {
      !A || this.recentDemands.has(A.parentId) || (this.recentDemands.set(A.parentId, {
        demand: A,
        retiredAt: l,
        expiresAt: l + Go
      }), c());
    }, u = o, h = t(u), f = !!h?.transition?.expected?.length && this.#re(h.parentId), p = (() => {
      this.idleExpansionParentId = null, this.idleExpansionStartedAt = null, this.idleExpansionCursor = 0, this.idleExpansionLastAdvanceAt = null;
      if (this.prepareFocus || this.detailFocusMode || !this.predictiveMovementIntent && this.horizontalSpeed < 0.5 || !this.liveFocus) return [];
      const A = this.traversalTarget ?? this.demandFocus;
      if (!A) return [];
      const F = A.x - this.liveFocus.x, k = A.z - this.liveFocus.z, C = Math.hypot(F, k);
      if (C < 90) return [];
      // Sample densely enough to enumerate every z17 parent crossed by the
      // prediction segment. A single 230 m sample can jump diagonally across a
      // narrow adjacent parent and prefetch the cell after it, making the
      // skipped cell load only on entry. Demand/guard caps below still bound
      // how many unique parents can become active.
      const D = F / C, G = k / C, L = this.locomotion === "flight" || this.locomotion === "glider" ? 120 : this.locomotion === "car" ? 90 : 45, j = this.locomotion === "flight" || this.locomotion === "glider" ? 40 : this.locomotion === "car" ? 32 : 28, N = Math.min(j, Math.max(1, Math.ceil(C / L))), P = [];
      for (let V = 1; V <= N; V++) {
        const Z = Math.min(C, L * V);
        P.push({ x: this.liveFocus.x + D * Z, y: this.liveFocus.y ?? 0, z: this.liveFocus.z + G * Z });
      }
      C > L * N + 30 && P.push({ x: A.x, y: A.y ?? this.liveFocus.y ?? 0, z: A.z });
      return P;
    })(), g = !this.prepareFocus && (this.detailFocusMode || this.horizontalSpeed >= 0.5 || p.length > 0) ? this.detailFocusMode ? [
      ...this.showcaseFocuses.map(t).filter(Boolean),
      ...a(u)
    ] : [...p, this.demandFocus].map(t).filter(Boolean) : [], b = [];
    for (const A of g)
      A.parentId === h?.parentId || b.some((F) => F.parentId === A.parentId) || b.push(A);
    const x = b.shift() ?? null, m = b, v = new Set(
      [this.activeDemand, this.forwardDemand].filter(Boolean).map((A) => A.parentId)
    ), w = new Map(
      [this.activeDemand, this.forwardDemand, ...this.guardDemands].filter(Boolean).map((A) => [A.parentId, A])
    ), T = (A) => {
      if (!A) return null;
      const F = w.get(A.parentId);
      if (F)
        return w.delete(A.parentId), q(F, A);
      const k = this.recentDemands.get(A.parentId);
      return k ? (this.recentDemands.delete(A.parentId), q(k.demand, A)) : r(A);
    };
    this.activeDemand = T(h);
    const M = !this.detailFocusMode && this.horizontalSpeed < 0.5 && (e.lruCache?.isFull?.() ?? !1) && this.activeDemand && !this.#re(this.activeDemand.parentId), S = new Set(this.activeDemand ? [this.activeDemand.parentId] : []);
    this.forwardDemand = x && !S.has(x.parentId) ? T(x) : null, this.forwardDemand && S.add(this.forwardDemand.parentId), this.guardDemands = [];
    for (const A of m) {
      const F = this.showcaseMode ? ds : this.roadFocusMode ? fs : this.detailFocusMode ? us : cs;
      if (this.guardDemands.length >= F || S.has(A.parentId)) continue;
      const k = T(A);
      k && (this.guardDemands.push(k), S.add(k.parentId));
    }
    for (const A of w.values())
      !M && v.has(A.parentId) ? d(A) : i(A);
    if (M)
      for (const [A, F] of this.recentDemands)
        this.recentDemands.delete(A), i(F.demand);
    this.#p();
    const R = [this.activeDemand, this.forwardDemand, ...this.guardDemands].filter(Boolean);
    if (!R.length) return;
    const O = this.demandContentPriorities;
    for (const A of [...e.loadingTiles ?? []]) {
      const F = Ge(A);
      A.internal?.loadingState === 1 && F && !O.has(F) && !this.models.get(F)?.selected && (this.expectedCancelledTiles.add(A), e.lruCache?.remove?.(A));
    }
    // Queue currJobs only covers the short fetch-dispatch callback. Once a
    // Response arrives, its body can still be downloading while currJobs has
    // already returned to zero. Counting only the queue therefore admitted an
    // entire 64-tile transition in a few frames (48–54 simultaneous bodies in
    // production), preventing a newly local, reranked tile from reaching the
    // front. Renderer stats span the full queued -> downloading -> parsing
    // lifecycle, so use the larger view as the real admission pressure.
    const queueOutstanding = (e.downloadQueue?.items?.length ?? 0) + (e.downloadQueue?.currJobs ?? 0), lifecycleOutstanding = (e.stats?.queued ?? 0) + (e.stats?.downloading ?? 0) + (e.stats?.parsing ?? 0), pipelineOutstanding = Math.max(queueOutstanding, lifecycleOutstanding), pipelineLimit = (e.downloadQueue?.maxJobs ?? 8) + 4, P = Math.max(0, pipelineLimit - pipelineOutstanding);
    this.metrics.requestPipelineOutstanding = pipelineOutstanding, this.metrics.maxRequestPipelineOutstanding = Math.max(this.metrics.maxRequestPipelineOutstanding, pipelineOutstanding);
    let I = 0;
    if (P <= 0) return;
    if (this.roadFocusMode) {
      const A = [this.activeDemand, this.forwardDemand].filter(Boolean), F = !!this.forwardDemand && !this.#re(this.forwardDemand.parentId);
      if (F) {
        const k = new Set(A.flatMap((C) => C.expected));
        for (const C of [...e.loadingTiles ?? []]) {
          const D = Ge(C);
          C.internal?.loadingState !== 1 || !D || k.has(D) || this.models.get(D)?.selected || (this.expectedCancelledTiles.add(C), e.lruCache?.remove?.(C));
        }
      }
      for (const k of A) {
        if (I >= P) break;
        I += this.#i(k, e, P - I, k === this.activeDemand || k === this.forwardDemand);
      }
      if (!F)
        for (const k of this.guardDemands) {
          if (I >= P) break;
          I += this.#i(
            k,
            e,
            Math.min(Bn, P - I)
          );
        }
      e.downloadQueue?.tryRunJobs?.(), e.parseQueue?.tryRunJobs?.(), e.processNodeQueue?.tryRunJobs?.();
      return;
    }
    const nextIncompleteGuard = this.guardDemands.find((A) => A && !this.#re(A.parentId)) ?? null, activeIncomplete = !!this.activeDemand && !this.#re(this.activeDemand.parentId), forwardIncomplete = !!this.forwardDemand && !this.#re(this.forwardDemand.parentId), W = !this.detailFocusMode ? activeIncomplete || forwardIncomplete ? [this.activeDemand, this.forwardDemand].filter(Boolean) : nextIncompleteGuard ? [this.activeDemand, this.forwardDemand, nextIncompleteGuard].filter(Boolean) : [this.activeDemand, this.forwardDemand].filter(Boolean) : R;
    for (const A of W) {
      if (I >= P) break;
      I += this.#i(
        A,
        e,
        Math.min(Bn, P - I),
        A === this.activeDemand || A === this.forwardDemand
      );
    }
    for (; I < P; ) {
      let A = !1;
      for (const F of W) {
        if (I >= P) break;
        const k = this.#i(F, e, 1, F === this.activeDemand || F === this.forwardDemand);
        I += k, A ||= k > 0;
      }
      if (!A) break;
    }
    // A predicted parent may become "recent" when the player pauses or
    // reverses just before its boundary. Retaining a 58/68 transition without
    // servicing the remaining tail makes detail appear only after entry and
    // causes atomic z17/z20 handoff flicker while crossing back and forth.
    // Active/forward work always gets the pipeline first; use only remaining
    // capacity to finish one nearby recent transition, two requests at a time.
    if (I < P && this.liveFocus) {
      const A = [...this.recentDemands.values()].map((F) => F.demand).filter((F) => F && !this.#re(F.parentId) && Te(this.liveFocus, this.logicalBoundsForId(F.parentId)) <= Es).sort((F, k) => Te(this.liveFocus, this.logicalBoundsForId(F.parentId)) - Te(this.liveFocus, this.logicalBoundsForId(k.parentId)))[0];
      if (A) {
        const F = this.#i(A, e, Math.min(2, P - I), !0);
        I += F, this.metrics.recentDemandRequests += F;
      }
    }
  }
  #A() {
    let e = this.prepareFocus ? [this.prepareFocus] : [this.liveFocus, this.demandFocus, this.traversalTarget, ...this.coarseGuardFocuses].filter(Boolean);
    this.locomotion === "walk" && this.activeDemand && !this.#M() && (e = [this.liveFocus ?? this.focus ?? this.demandFocus].filter(Boolean));
    const t = e.filter((n, a) => e.findIndex((i) => Math.hypot(i.x - n.x, i.z - n.z) < 30) === a);
    for (const n of t) {
      const a = ye(n, 15), i = ye(n, 16), r = ye(n, 17), l = /* @__PURE__ */ new Map([[15, /* @__PURE__ */ new Set([a])]]), o = this.ownership.transitions?.[a];
      l.set(16, new Set(
        o?.complete && o.childZoom === 16 ? o.expected : [i]
      ));
      const c = this.ownership.transitions?.[i];
      l.set(17, new Set(
        c?.complete && c.childZoom === 17 ? c.expected : [r]
      ));
      for (const [d, u] of l) {
        if (!this.indexedZooms.has(d)) continue;
        const h = this.layers.get(d);
        for (const f of u) {
          const p = this.stagedContentTiles.get(f);
          p && (h?.lruCache?.markUsed?.(p.tile), p.tile.internal?.loadingState === 0 && h?.requestTileContents?.(p.tile));
        }
      }
    }
  }
  #p() {
    const e = this.activeOwnershipPriorities, t = this.demandContentPriorities, n = this.activeDemandContentIds;
    e.clear(), t.clear(), n.clear();
    const a = (c, d, u = !0) => {
      if (!c) return;
      for (const h of c.expected) {
        const f = t.get(h);
        (f == null || d < f) && t.set(h, d), u && n.add(h);
      }
    };
    a(this.activeDemand, 0), a(this.forwardDemand, 5);
    const primaryReady = (!this.activeDemand || this.#re(this.activeDemand.parentId)) && (!this.forwardDemand || this.#re(this.forwardDemand.parentId));
    let protectedGuard = !1;
    for (const c of this.guardDemands) {
      const d = primaryReady && !protectedGuard && !this.#re(c.parentId);
      a(c, 6, d), protectedGuard ||= d;
    }
    for (const { demand: c } of this.recentDemands.values()) a(c, 12, !1);
    let i = this.activeDemand?.parentId ?? null;
    const r = [], l = /* @__PURE__ */ new Set();
    for (; i && !l.has(i); ) {
      l.add(i);
      const c = parentTransitionId(this.ownership, i);
      if (!c) break;
      const d = this.ownership.transitions?.[c];
      if (!d?.complete) break;
      r.push({ parent: c, transition: d }), i = c;
    }
    r.reverse().forEach(({ parent: c, transition: d }, u) => {
      e.set(c, -95 + u * 5);
      for (const h of d.expected ?? []) {
        const f = -90 + u * 5;
        (!e.has(h) || f < e.get(h)) && e.set(h, f);
      }
    });
  }
  #M() {
    if (!this.activeDemand) return !0;
    for (const e of this.activeOwnershipPriorities.keys())
      if (!this.models.get(e)?.visualReady) return !1;
    return !0;
  }
  #S(e, t, n) {
    const a = this.progressTelemetry;
    if (!t || !Number.isFinite(t.x) || !Number.isFinite(t.z)) return;
    const i = a.lastPosition;
    if ((!i || Math.hypot(t.x - i.x, t.z - i.z) >= 0.75) && (a.lastPosition = { x: t.x, z: t.z }, a.lastMovedAt = e, a.blockedSince = null, a.blockedProgressMs = 0), !(this.locomotion === "walk" && n && this.horizontalSpeed < 0.5)) {
      a.blockedSince = null, a.blockedProgressMs = 0;
      return;
    }
    a.blockedSince ??= a.lastMovedAt ?? e, a.blockedProgressMs = Math.max(0, e - a.blockedSince), a.maxBlockedProgressMs = Math.max(
      a.maxBlockedProgressMs,
      a.blockedProgressMs
    );
  }
  #R(e) {
    const t = this.progressTelemetry, n = this.activeDemand, a = !!n?.expected?.length && this.#re(n.parentId), i = a && n.expected.every((r) => {
      const l = this.models.get(r);
      return l?.selected || l?.oceanOnlyRefinement;
    });
    if (!a || i) {
      t.detailStarvationSince = null, t.detailStarvationMs = 0;
      return;
    }
    t.detailStarvationSince ??= e, t.detailStarvationMs = Math.max(0, e - t.detailStarvationSince), t.maxDetailStarvationMs = Math.max(
      t.maxDetailStarvationMs,
      t.detailStarvationMs
    );
  }
  #i(e, t, n, a = !1) {
    for (const i of e.regions) {
      const r = this.z20RegionTiles.get(i);
      r && (t.lruCache?.markUsed?.(r), r.internal?.loadingState === 0 && t.requestTileContents?.(r));
    }
    let i = 0;
    for (const s of e.expected) {
      const r = this.stagedContentTiles.get(s);
      if (!r) continue;
      t.lruCache?.markUsed?.(r.tile);
      if (this.models.get(s)?.meshReady) continue;
      if (r.tile.internal?.loadingState === 4 && !this.models.has(s)) {
        t.lruCache?.has?.(r.tile) && t.lruCache.remove(r.tile), r.tile.internal && (r.tile.internal.loadingState = 0), this.metrics.ghostTileRepairs++;
      }
      if (r.tile.internal?.loadingState !== 0) continue;
      if (i >= n) break;
      if (!a && t.lruCache?.isFull?.()) return n;
      t.requestTileContents?.(r.tile);
      if (a && r.tile.internal?.loadingState === 0 && t.lruCache?.isFull?.()) {
        const l = t.lruCache, o = l.maxBytesSize, c = this.resourceProfile === "constrained" ? 48e7 : 9e8, d = Math.min(c, Math.max(o, l.cachedBytes + 16e6));
        d > o && (l.maxBytesSize = d, this.metrics.requestHeadroomExpansions++, t.requestTileContents?.(r.tile));
      }
      if (r.tile.internal?.loadingState === 0) {
        this.metrics.requestAdmissionRejects++;
        i = n;
        break;
      }
      const l = this.now();
      r.requestedAt ??= l, r.firstRequestedAt ??= l, r.lastRequestedAt = l, r.requestCount = (r.requestCount ?? 0) + 1, e.requested.add(s), i++;
    }
    return i;
  }
  #E() {
    const e = this.layers.get(20);
    let t = !1;
    for (const n of [
      this.activeDemand,
      this.forwardDemand,
      ...this.guardDemands,
      ...[...this.recentDemands.values()].map((a) => a.demand)
    ])
      if (n) {
        t = !0;
        for (const a of n.requested) {
          const i = this.stagedContentTiles.get(a), r = this.models.get(a);
          i && i.tile.internal?.loadingState === 1 && !r?.selected && e?.lruCache?.has?.(i.tile) && (this.expectedCancelledTiles.add(i.tile), e.lruCache.remove(i.tile));
        }
      }
    this.activeDemand = null, this.forwardDemand = null, this.guardDemands = [], this.recentDemands.clear(), this.activeOwnershipPriorities.clear(), this.demandContentPriorities.clear(), this.activeDemandContentIds.clear(), t && this.metrics.cancelled++;
  }
  #C(e, t, n) {
    if (this.disposed) return;
    const a = Ge(t);
    if (!a) return;
    const i = this.models.get(a);
    i && i.pinCount === 0 && this.#o(i, !0), n.updateMatrix();
    const r = n.clone(!0);
    r.matrix.copy(n.matrix), r.matrix.decompose(r.position, r.quaternion, r.scale), r.visible = !1, this.modelsGroup.add(r), r.updateWorldMatrix(!0, !0);
    const l = cl(this.THREE, r), o = l.max.y < -25, c = {
      id: a,
      zoom: e,
      tile: t,
      sourceScene: n,
      scene: r,
      bounds: l,
      meshes: [],
      meshReady: !!l,
      visualReady: !1,
      companion: null,
      companionDepth: null,
      companionController: null,
      companionRetryTimer: null,
      companionState: "not-required",
      companionAttempts: 0,
      companionError: null,
      companionRequired: !1,
      companionWasVisible: !1,
      splatMeta: null,
      textureState: "not-required",
      textureAttempts: 0,
      textureError: null,
      selected: !1,
      pinCount: 0,
      disposed: !1,
      lastSelectedAt: -1 / 0,
      selectedAt: null,
      hiddenAt: null,
      rendererActiveAt: -1 / 0,
      transitionParentId: parentTransitionId(this.ownership, a),
      column: t.extras?.sourceColumn ?? null,
      logicalBounds: this.logicalBoundsForId(a),
      coverageBounds: null,
      clipOwnerId: null,
      clipPlanes: null,
      splatOnly: t.extras?.source?.contentKind === "splat-only",
      collisionEligible: t.extras?.source?.collisionEligible !== !1,
      projectedCoverage: null,
      projectedCoverageState: "not-required",
      projectedCoverageGeneration: 0,
      projectedCoverageQueuedAt: null,
      replacement: null,
      sourceIndices: [],
      sourceGeometries: [],
      sourceIndexReferencedBytes: 0,
      sourceIndexOwnedBytes: 0,
      suppressedTriangleCount: 0,
      oceanSkirts: [],
      oceanBacking: null,
      queryMeshes: null,
      oceanSurfaceY: null,
      oceanOnlyPage: !1,
      // Independently quantized pure-water refinements are useful readiness
      // and traversal nodes, but cannot become render/query owners without
      // cutting rectangular water plates into the continuous z15 Apple ocean.
      // Mixed shoreline, bridge, and structure descendants still promote.
      oceanOnlyRefinement: !1,
      // Pure fine-ocean pages are still loaded and participate in atomic
      // readiness, but rendering their independently quantized flat surfaces
      // creates a visible 30 m stair-step grid. The selected Apple parent
      // water remains visible beneath them; mixed shoreline pages and all
      // h>0 bridge/structure pages remain exact.
      oceanOnlyFinePage: !1,
      oceanClassification: null
    }, d = qn(this.THREE, c.logicalBounds, ut);
    c.clipPlanes = d, c.coverageBounds = c.logicalBounds, r.traverse((m) => {
      if (!m.isMesh) return;
      const v = c.meshes.length;
      if (c.meshes.push(m), e === 20) {
        const M = m.geometry?.attributes?.position?.count ?? 0;
        if (c.sourceGeometries[v] = m.geometry, m.geometry?.index) {
          // Loader geometry is immutable for the record lifetime. Suppression
          // clones the geometry/index below before changing its draw index.
          const S = m.geometry.index.array;
          c.sourceIndices[v] = S, c.sourceIndexReferencedBytes += S.byteLength ?? 0;
        } else {
          const S = Uint32Array.from({ length: M }, (R, E) => E);
          c.sourceIndices[v] = S, c.sourceIndexOwnedBytes += S.byteLength;
        }
      }
      const T = (Array.isArray(m.material) ? m.material : [m.material]).map((M) => {
        const S = M.clone();
        return S.clippingPlanes = d, S.clipIntersection = !1, S.depthTest = !0, S.depthWrite = !0, e < 20 && this.surfaceHoleFallback && (S.polygonOffset = !0, S.polygonOffsetFactor = e === 17 ? 1.5 : e === 16 ? 3 : 5, S.polygonOffsetUnits = S.polygonOffsetFactor), S;
      });
      m.material = Array.isArray(m.material) ? T : T[0], c.splatOnly && (m.visible = !1), e < 20 && this.surfaceHoleFallback && this.#L(c, m), m.renderOrder = e === 20 ? 0 : e === 17 ? 1 : e === 16 ? 2 : 3;
    });
    const u = !c.splatOnly && (!!t.extras?.source?.sourceTextureSha256 || c.meshes.some((m) => !!m.geometry?.attributes?.uv?.count)), h = c.meshes.some((m) => (Array.isArray(m.material) ? m.material : [m.material]).some((v) => rl(v?.map)));
    c.textureState = u ? h ? "ready" : "missing" : "not-required", c.oceanSurfaceY = this.#D(c);
    const f = c.oceanSurfaceY == null ? 1 / 0 : this.#P(c, c.oceanSurfaceY), p = Math.max(
      1,
      (c.bounds.max.x - c.bounds.min.x) * (c.bounds.max.z - c.bounds.min.z)
    ), y = Number.isFinite(c.oceanSurfaceArea) && c.oceanSurfaceArea >= p * 0.35, g = Math.max(4, p * 0.015);
    c.oceanOnlyPage = !!(c.oceanSurfaceY != null && (o || y) && f < g), c.oceanOnlyFinePage = e === 20 && c.oceanOnlyPage, c.oceanOnlyRefinement = e > 15 && c.oceanOnlyPage, c.oceanClassification = {
      legacyAabb: o,
      oceanArea: c.oceanSurfaceArea ?? 0,
      raisedArea: Number.isFinite(f) ? f : null,
      footprintArea: p,
      raisedAreaLimit: g
    };
    for (const m of c.meshes)
      if ((c.splatOnly || c.oceanOnlyFinePage || this.debugHideOceanSources && c.oceanSurfaceY != null) && (m.visible = !1), e === 15 && c.oceanSurfaceY != null && this.surfaceHoleFallback)
        for (const v of Array.isArray(m.material) ? m.material : [m.material])
          v.polygonOffset = !0, v.polygonOffsetFactor = 12, v.polygonOffsetUnits = 12;
    c.oceanSurfaceY != null && this.#u(c, c.logicalBounds), e === 20 && this.#r(c, { rebuildCoverage: !1 });
    const b = t.extras?.nativeSplats;
    if (c.splatMeta = b ?? null, c.companionState = b ? "deferred" : "not-required", this.models.set(a, c), this.modelsByZoom.get(e)?.add(c), this.residentByteStats.sourceIndicesReferenced += c.sourceIndexReferencedBytes, this.residentByteStats.sourceIndicesOwned += c.sourceIndexOwnedBytes, e === 20 && c.transitionParentId && this.z20ParentResidentCounts.set(c.transitionParentId, (this.z20ParentResidentCounts.get(c.transitionParentId) ?? 0) + 1), b && this.splatModels.add(c), this.byTile.set(t, c), n.visible = !1, this.metrics.loads++, c.textureState === "missing") {
      this.#O(c);
      return;
    }
    const x = this.textureRetries.get(a);
    x && clearTimeout(x.timer), this.textureRetries.delete(a), this.#F(c, c.coverageBounds), this.#b(c);
  }
  #ie(e, t, n) {
    if (!e || t === n) return;
    const a = e.transitionParentId;
    if (!a) return;
    const i = this.transitionReadyCounts.get(a) ?? 0, r = Math.max(0, i + (n ? 1 : -1)), l = this.ownership?.transitions?.[a]?.expected?.length ?? 0;
    this.transitionReadyCounts.set(a, r), (i === l) !== (r === l) && (this.replacementSelectionSignature = ""), this.metrics.transitionReadyMutations++;
  }
  #re(e) {
    const t = this.ownership?.transitions?.[e];
    return this.metrics.transitionReadyChecks++, !!t && (this.transitionReadyCounts.get(e) ?? 0) === (t.expected?.length ?? 0);
  }
  #le(e, t = this.ownership?.transitions?.[e]) {
    if (!t?.expected) return [];
    if (Array.isArray(t.expected)) return t.expected;
    const n = this.transitionExpectedCache.get(e);
    if (n) return n;
    const a = [...t.expected];
    if (this.transitionExpectedCache.size >= 96) {
      const i = this.transitionExpectedCache.keys().next().value;
      this.transitionExpectedCache.delete(i);
    }
    return this.transitionExpectedCache.set(e, a), a;
  }
  #e(e) {
    if (!e || e.disposed) return;
    const t = e.textureState === "ready" || e.textureState === "not-required", n = !e.companionRequired || e.companionState === "ready" || e.companionState === "not-required" || // A permanently unavailable optional sidecar degrades to the exact
    // Apple mesh instead of holding a green placeholder or retrying forever.
    // The failure remains explicit in telemetry and is retried only after
    // the source record itself is evicted and genuinely reloaded.
    e.companionState === "failed" || // A mesh that already completed an honest visual handoff must remain
    // selected while a newly-near foliage companion is admitted. Dropping
    // visualReady here feeds record.selected back into companion admission:
    // selected -> companion required/loading -> unselected -> companion
    // optional -> selected, producing a visible one-frame oscillation at
    // the 90-140 m sidecar boundary. Initial handoffs still wait for every
    // parity-required companion because an unselected record cannot latch.
    !!(e.selected && e.visualReady), a = e.projectedCoverageState === "ready" || e.projectedCoverageState === "not-required", i = e.visualReady, r = !!(e.meshReady && t && n && a);
    e.visualReady = r, this.#ie(e, i, r);
  }
  #F(e, t) {
    if (!e?.collisionEligible) {
      e.projectedCoverageState = "not-required", e.projectedCoverage = null, this.#e(e);
      return;
    }
    const n = ++e.projectedCoverageGeneration, a = e.queryMeshes ?? e.meshes, i = za(this.THREE, a, t);
    if (!i) {
      e.projectedCoverageState = "failed", e.projectedCoverage = null, this.#e(e), this.errors.push(`${e.id} projected coverage could not be initialized`);
      return;
    }
    if (e.projectedCoverageState = "building", e.projectedCoverageQueuedAt = this.now(), e.projectedCoverage = null, this.#e(e), dl(a) <= tl) {
      Cs(i), e.projectedCoverage = Fs(i), e.projectedCoverageState = "ready", e.projectedCoverageQueuedAt = null, this.#e(e);
      return;
    }
    this.projectedCoverageJobs.set(e.id, { record: e, generation: n, job: i });
  }
  #c(e) {
    if (e.selected) return -100;
    const t = this.activeOwnershipPriorities.get(e.id);
    return this.metrics.demandPriorityLookups++, t ?? this.demandContentPriorities.get(e.id) ?? (e.zoom < 20 ? 20 + e.zoom : 100);
  }
  #k() {
    if (!this.projectedCoverageJobs.size) return;
    let e = !1;
    for (const a of this.activeDemandContentIds)
      if (this.projectedCoverageJobs.has(a)) {
        e = !0;
        break;
      }
    const t = performance.now(), n = e ? nl : sl, a = t + n;
    let r = 0, l = null;
    for (; this.projectedCoverageJobs.size && performance.now() < a; ) {
      if (!l) {
        let c = 1 / 0;
        for (const [d, u] of this.projectedCoverageJobs) {
          const h = u.record;
          if (h.disposed || this.models.get(h.id) !== h || u.generation !== h.projectedCoverageGeneration) {
            this.projectedCoverageJobs.delete(d);
            continue;
          }
          this.metrics.projectedPriorityScans++;
          const f = this.#c(h);
          f < c && (c = f, l = u);
        }
        if (!l) break;
      }
      Cs(l.job, {
        deadline: a,
        maxTriangles: al
      }) && (this.projectedCoverageJobs.delete(l.record.id), !l.record.disposed && this.models.get(l.record.id) === l.record && l.generation === l.record.projectedCoverageGeneration && (l.record.projectedCoverage = Fs(l.job), l.record.projectedCoverageState = "ready", l.record.projectedCoverageQueuedAt = null, this.#e(l.record), r++), l = null);
    }
    this.metrics.projectedCoverageMs += performance.now() - t, this.metrics.projectedCoverageCompleted += r;
  }
  #O(e) {
    const t = this.textureRetries.get(e.id), n = (t?.attempt ?? 0) + 1;
    if (t?.timer != null && clearTimeout(t.timer), e.textureAttempts = n, e.textureError = "GLTFLoader returned source geometry without its embedded JPEG", n > Hn) {
      e.textureState = "failed", this.textureRetries.delete(e.id), this.metrics.textureFailures++, this.errors.push(`${e.id} texture failed after ${Hn} retries`);
      return;
    }
    e.textureState = "retry-wait", this.metrics.textureRetries++;
    const a = 250 * 2 ** (n - 1), i = setTimeout(() => {
      const r = this.textureRetries.get(e.id);
      if (r && (r.timer = null), this.disposed || e.disposed || this.models.get(e.id) !== e) return;
      const l = this.layers.get(e.zoom);
      l?.lruCache?.remove?.(e.tile), e.tile.internal && (e.tile.internal.loadingState = 0), l?.requestTileContents?.(e.tile);
      const o = this.stagedContentTiles.get(e.id);
      if (o) {
        const c = this.now();
        o.requestedAt = c, o.firstRequestedAt ??= c, o.lastRequestedAt = c, o.requestCount = (o.requestCount ?? 0) + 1;
      }
    }, a);
    this.textureRetries.set(e.id, { attempt: n, timer: i });
  }
  #m(e, t) {
    if (e.disposed || this.models.get(e.id) !== e) return;
    e.companionAttempts++, e.companionState = "loading", e.companionError = null;
    const n = new AbortController();
    e.companionController = n;
    let a = !1;
    const i = setTimeout(() => {
      e.disposed || this.models.get(e.id) !== e || n.signal.aborted || (a = !0, n.abort(de(`Splat companion timed out after ${Un}ms`)));
    }, Un);
    this.splats.load({ ...t, sourceZoom: e.zoom }, n.signal).then((r) => {
      if (clearTimeout(i), e.disposed || this.models.get(e.id) !== e || !e.companionRequired) {
        this.metrics.lateAttachRejects++, this.splats.dispose(r);
        return;
      }
      r.material && (r.material.clippingPlanes = e.clipPlanes, r.material.clipIntersection = !1), r.visible = !1, r.userData?.depthMesh && (r.userData.depthMesh.visible = !1), this.splats.attach(e, r), e.companionState = "ready", this.#e(e);
    }).catch((r) => {
      if (clearTimeout(i), !(e.disposed || this.models.get(e.id) !== e || n.signal.aborted && !a || r.name === "AbortError" && !a)) {
        if (e.companionAttempts < ps) {
          e.companionState = "retry-wait";
          const o = 350 * 2 ** (e.companionAttempts - 1);
          e.companionRetryTimer = setTimeout(() => {
            e.companionRetryTimer = null, this.#m(e, t);
          }, o);
          return;
        }
        e.companionState = "failed", e.companionError = String(r.message ?? r), this.#e(e), this.errors.push(
          `${e.id} splat companion failed after ${e.companionAttempts} attempts: ${e.companionError}`
        );
      }
    });
  }
  #b(e, t = null, n = null) {
    if (!e?.splatMeta || e.disposed) return;
    t ??= new Set(this.activeDemand?.expected ?? []), n ??= new Set(this.activeOwnershipPriorities.keys());
    const i = this.detailFocusMode && e.zoom === 20 && e.selected && this.liveFocus && Te(this.liveFocus, e.coverageBounds ?? e.logicalBounds) <= Do || pl(e, {
      liveFocus: this.liveFocus,
      locomotion: this.locomotion,
      horizontalSpeed: this.horizontalSpeed,
      altitudeAboveGround: this.altitudeAboveGround,
      activeExactIds: t,
      activeCoarseIds: n
    });
    if (e.companionRequired = i, i) {
      e.companionState === "deferred" && e.companionAttempts < ps ? this.#m(e, e.splatMeta) : e.companionAttempts >= ps && e.companionState !== "ready" && (e.companionState = "failed"), this.#e(e);
      return;
    }
    e.companionRetryTimer != null && (clearTimeout(e.companionRetryTimer), e.companionRetryTimer = null), e.companionState === "loading" && e.companionController?.abort(de("Companion deferred by travel policy")), e.companion && (this.splats.dispose(e.companion), e.companion = null, e.companionDepth = null), e.companionState !== "failed" && (e.companionState = "deferred", e.companionError = null), this.#e(e);
  }
  #I() {
    const e = new Set(this.activeDemand?.expected ?? []), t = new Set(this.activeOwnershipPriorities.keys());
    for (const n of this.splatModels) this.#b(n, e, t);
  }
  #se(e) {
    const a = e.logicalBounds;
    for (const i of e.meshes) {
      const r = i.geometry, l = r?.attributes?.position, o = r?.attributes?.uv;
      if (!l) continue;
      const c = r.index?.array ?? Uint32Array.from(
        { length: l.count },
        (E, O) => O
      ), d = /* @__PURE__ */ new Map(), u = (E, O) => {
        const I = E < O ? `${E}/${O}` : `${O}/${E}`, A = d.get(I);
        A ? A.count++ : d.set(I, { a: E, b: O, count: 1 });
      };
      for (let E = 0; E + 2 < c.length; E += 3) {
        const O = c[E], I = c[E + 1], A = c[E + 2];
        u(O, I), u(I, A), u(A, O);
      }
      i.updateWorldMatrix(!0, !1);
      const h = i.matrixWorld.clone().invert(), f = new this.THREE.Vector3(), p = new this.THREE.Vector3(), y = new this.THREE.Vector3(), g = new this.THREE.Vector3(), b = new this.THREE.Vector3(), x = new this.THREE.Vector3(), m = [], v = [], w = (E, O) => {
        m.push(E.x, E.y, E.z), o && v.push(o.getX(O), o.getY(O));
      };
      for (const E of d.values()) {
        if (E.count !== 1) continue;
        f.fromBufferAttribute(l, E.a), p.fromBufferAttribute(l, E.b), y.copy(f).applyMatrix4(i.matrixWorld), g.copy(p).applyMatrix4(i.matrixWorld);
        const O = Math.abs(y.x - a.minX) < 0.3 && Math.abs(g.x - a.minX) < 0.3 || Math.abs(y.x - a.maxX) < 0.3 && Math.abs(g.x - a.maxX) < 0.3, I = Math.abs(y.z - a.minZ) < 0.3 && Math.abs(g.z - a.minZ) < 0.3 || Math.abs(y.z - a.maxZ) < 0.3 && Math.abs(g.z - a.maxZ) < 0.3;
        !e.oceanOnlyPage && !O && !I || (b.copy(y), b.y -= 1.5, b.applyMatrix4(h), x.copy(g), x.y -= 1.5, x.applyMatrix4(h), w(f, E.a), w(p, E.b), w(x, E.b), w(f, E.a), w(x, E.b), w(b, E.a));
      }
      if (!m.length) continue;
      const T = new this.THREE.BufferGeometry();
      T.setAttribute("position", new this.THREE.Float32BufferAttribute(m, 3)), v.length && T.setAttribute("uv", new this.THREE.Float32BufferAttribute(v, 2)), T.computeVertexNormals(), T.computeBoundingSphere();
      const S = (Array.isArray(i.material) ? i.material[0] : i.material).clone();
      S.side = this.THREE.DoubleSide;
      const R = new this.THREE.Mesh(T, S);
      R.name = `${e.id}-apple-ocean-seam-skirt`, R.position.copy(i.position), R.quaternion.copy(i.quaternion), R.scale.copy(i.scale), R.renderOrder = i.renderOrder, R.userData.convertedOceanSkirtGeometry = !0, i.parent.add(R), e.oceanSkirts.push(R);
    }
  }
  #D(e) {
    const t = /* @__PURE__ */ new Map(), n = new this.THREE.Vector3(), a = new this.THREE.Vector3(), i = new this.THREE.Vector3();
    for (const o of e.meshes) {
      const c = o.geometry?.attributes?.position;
      if (!c) continue;
      const d = o.geometry.index?.array ?? Uint32Array.from(
        { length: c.count },
        (u, h) => h
      );
      o.updateWorldMatrix(!0, !1);
      for (let u = 0; u + 2 < d.length; u += 3) {
        n.fromBufferAttribute(c, d[u]).applyMatrix4(o.matrixWorld), a.fromBufferAttribute(c, d[u + 1]).applyMatrix4(o.matrixWorld), i.fromBufferAttribute(c, d[u + 2]).applyMatrix4(o.matrixWorld);
        const h = Math.max(n.y, a.y, i.y), f = Math.min(n.y, a.y, i.y);
        if (h >= -25 || h - f > 0.3) continue;
        const p = Math.abs((a.x - n.x) * (i.z - n.z) - (a.z - n.z) * (i.x - n.x));
        if (p < 0.5) continue;
        const y = (n.y + a.y + i.y) / 3, g = Math.round(y * 10) / 10, b = t.get(g) ?? { area: 0, weightedY: 0 };
        b.area += p * 0.5, b.weightedY += y * p * 0.5, t.set(g, b);
      }
    }
    const r = [...t.entries()].filter(([, o]) => o.area >= 20).sort(([o], [c]) => c - o);
    if (!r.length) return null;
    const l = r[0][1];
    return e.oceanSurfaceArea = l.area, l.weightedY / l.area;
  }
  #P(e, t) {
    let n = 0;
    const a = new this.THREE.Vector3(), i = new this.THREE.Vector3(), r = new this.THREE.Vector3();
    for (const l of e.meshes) {
      const o = l.geometry?.attributes?.position;
      if (!o) continue;
      const c = l.geometry.index?.array ?? Uint32Array.from(
        { length: o.count },
        (d, u) => u
      );
      l.updateWorldMatrix(!0, !1);
      for (let d = 0; d + 2 < c.length; d += 3)
        a.fromBufferAttribute(o, c[d]).applyMatrix4(l.matrixWorld), i.fromBufferAttribute(o, c[d + 1]).applyMatrix4(l.matrixWorld), r.fromBufferAttribute(o, c[d + 2]).applyMatrix4(l.matrixWorld), !(Math.max(a.y, i.y, r.y) <= t + 1.25) && (n += Math.abs((i.x - a.x) * (r.z - a.z) - (i.z - a.z) * (r.x - a.x)) * 0.5);
    }
    return n;
  }
  #u(e, t, n = null) {
    if (e.oceanSurfaceY == null || !t) return;
    if (!e.oceanBacking) {
      let h = null, f = null;
      for (const F of e.meshes) {
        const C = (Array.isArray(F.material) ? F.material : [F.material]).find((D) => D?.map);
        if (C && F.geometry?.attributes?.position && F.geometry?.attributes?.uv) {
          h = F, f = C;
          break;
        }
      }
      if (!h || !f) return;
      h.updateWorldMatrix(!0, !1);
      const p = h.geometry.attributes.position, y = h.geometry.attributes.uv, g = (t.minX + t.maxX) * 0.5, b = (t.minZ + t.maxZ) * 0.5, x = Math.max(1e-6, t.maxX - t.minX), m = Math.max(1e-6, t.maxZ - t.minZ), v = new Float64Array(9), w = new Float64Array(3), T = new Float64Array(3), M = new this.THREE.Vector3();
      for (let F = 0; F < p.count; F++) {
        M.fromBufferAttribute(p, F).applyMatrix4(h.matrixWorld);
        const k = (M.x - g) / x, C = (M.z - b) / m, D = [k, C, 1], G = y.getX(F), L = y.getY(F);
        for (let j = 0; j < 3; j++) {
          w[j] += D[j] * G, T[j] += D[j] * L;
          for (let N = 0; N < 3; N++) v[j * 3 + N] += D[j] * D[N];
        }
      }
      const S = (F) => {
        const k = [
          [v[0], v[1], v[2], F[0]],
          [v[3], v[4], v[5], F[1]],
          [v[6], v[7], v[8], F[2]]
        ];
        for (let C = 0; C < 3; C++) {
          let D = C;
          for (let L = C + 1; L < 3; L++)
            Math.abs(k[L][C]) > Math.abs(k[D][C]) && (D = L);
          if (Math.abs(k[D][C]) < 1e-10) return null;
          [k[C], k[D]] = [k[D], k[C]];
          const G = k[C][C];
          for (let L = C; L < 4; L++) k[C][L] /= G;
          for (let L = 0; L < 3; L++) {
            if (L === C) continue;
            const j = k[L][C];
            for (let N = C; N < 4; N++) k[L][N] -= j * k[C][N];
          }
        }
        return k.map((C) => C[3]);
      }, R = S(w), E = S(T);
      if (!R || !E) return;
      const O = new this.THREE.BufferGeometry(), I = f.clone();
      I.side = this.THREE.DoubleSide, I.depthTest = !0, I.depthWrite = !0, I.clippingPlanes = e.clipPlanes;
      const A = new this.THREE.Mesh(O, I);
      A.name = `${e.id}-apple-ocean-source-backing`, A.visible = !1, A.renderOrder = e.zoom === 20 ? 0 : e.zoom === 17 ? 1 : e.zoom === 16 ? 2 : 3, A.userData.convertedOceanBackingGeometry = !0, this.root.add(A), e.oceanBacking = { mesh: A, fitU: R, fitV: E, centerX: g, centerZ: b, scaleX: x, scaleZ: m }, e.oceanOnlyFinePage && (e.queryMeshes = [A]);
    }
    const a = e.oceanBacking, i = 0.85, r = e.oceanOnlyFinePage ? ut : 0, l = e.oceanOnlyPage ? [[
      t.minX - r,
      t.maxX + r,
      t.minZ - r,
      t.maxZ + r
    ]] : [
      [t.minX, Math.min(t.maxX, t.minX + i), t.minZ, t.maxZ],
      [Math.max(t.minX, t.maxX - i), t.maxX, t.minZ, t.maxZ],
      [t.minX, t.maxX, t.minZ, Math.min(t.maxZ, t.minZ + i)],
      [t.minX, t.maxX, Math.max(t.minZ, t.maxZ - i), t.maxZ]
    ], o = [], c = [], d = [];
    for (const [h, f, p, y] of l) {
      const g = o.length / 3;
      for (const [b, x] of [[h, p], [f, p], [f, y], [h, y]]) {
        const m = n ? n[0] * b + n[1] * x + n[2] : e.oceanSurfaceY - 0.015;
        o.push(b, m, x);
        const v = (b - a.centerX) / a.scaleX, w = (x - a.centerZ) / a.scaleZ;
        c.push(
          a.fitU[0] * v + a.fitU[1] * w + a.fitU[2],
          a.fitV[0] * v + a.fitV[1] * w + a.fitV[2]
        );
      }
      d.push(g, g + 1, g + 2, g, g + 2, g + 3);
    }
    const u = a.mesh.geometry;
    u.setIndex(d), u.setAttribute("position", new this.THREE.Float32BufferAttribute(o, 3)), u.setAttribute("uv", new this.THREE.Float32BufferAttribute(c, 2)), u.computeVertexNormals(), u.computeBoundingSphere();
  }
  #z(e) {
    const t = [...e].map((o) => this.models.get(o)).filter((o) => o?.oceanBacking && Number.isFinite(o.oceanSurfaceY)), n = [...e].map((o) => this.models.get(o)).filter((o) => o?.oceanOnlyFinePage && o.oceanBacking && Number.isFinite(o.oceanSurfaceY));
    if (n.length < 3) {
      this.oceanUnderlay && (this.oceanUnderlay.visible = !1);
      return;
    }
    const a = new Float64Array(9), i = new Float64Array(3);
    for (const o of n) {
      const c = o.coverageBounds ?? o.logicalBounds, d = (c.minX + c.maxX) * 0.5, u = (c.minZ + c.maxZ) * 0.5, h = [d, u, 1];
      for (let f = 0; f < 3; f++) {
        i[f] += h[f] * o.oceanSurfaceY;
        for (let p = 0; p < 3; p++) a[f * 3 + p] += h[f] * h[p];
      }
    }
    const r = [
      [a[0], a[1], a[2], i[0]],
      [a[3], a[4], a[5], i[1]],
      [a[6], a[7], a[8], i[2]]
    ];
    for (let o = 0; o < 3; o++) {
      let c = o;
      for (let u = o + 1; u < 3; u++)
        Math.abs(r[u][o]) > Math.abs(r[c][o]) && (c = u);
      if (Math.abs(r[c][o]) < 1e-10) return;
      [r[o], r[c]] = [r[c], r[o]];
      const d = r[o][o];
      for (let u = o; u < 4; u++) r[o][u] /= d;
      for (let u = 0; u < 3; u++) {
        if (u === o) continue;
        const h = r[u][o];
        for (let f = o; f < 4; f++) r[u][f] -= h * r[o][f];
      }
    }
    const l = r.map((o) => o[3]);
    this.splats.setOceanPlane?.(l);
    for (const o of n)
      this.#u(o, o.coverageBounds ?? o.logicalBounds, l);
    this.#_(t, l);
  }
  #_(e, t) {
    const n = e.filter((p) => {
      if (!this.liveFocus) return !0;
      const y = p.coverageBounds ?? p.logicalBounds, g = Math.max(y.minX - this.liveFocus.x, 0, this.liveFocus.x - y.maxX), b = Math.max(y.minZ - this.liveFocus.z, 0, this.liveFocus.z - y.maxZ);
      return Math.hypot(g, b) < 2600;
    });
    if (!n.length) {
      this.oceanUnderlay && (this.oceanUnderlay.visible = !1);
      return;
    }
    let a = 1 / 0, i = -1 / 0, r = 1 / 0, l = -1 / 0;
    for (const p of n) {
      const y = p.coverageBounds ?? p.logicalBounds;
      a = Math.min(a, y.minX), i = Math.max(i, y.maxX), r = Math.min(r, y.minZ), l = Math.max(l, y.maxZ);
    }
    const o = n.find((p) => p.oceanOnlyPage)?.oceanBacking ?? n[0].oceanBacking;
    if (!o?.mesh?.material?.map) return;
    if (!this.oceanUnderlay) {
      const p = new this.THREE.BufferGeometry(), y = o.mesh.material.clone();
      y.map = o.mesh.material.map.clone(), y.map.userData.convertedSessionOwned = !0, y.map.needsUpdate = !0, y.clippingPlanes = [], y.side = this.THREE.DoubleSide, y.depthTest = !0, y.depthWrite = !0;
      const g = new this.THREE.Mesh(p, y);
      g.name = "apple-ocean-source-seam-underlay", g.renderOrder = 4, g.userData.convertedOceanUnderlayGeometry = !0, this.root.add(g), this.oceanUnderlay = g;
    }
    const c = this.oceanUnderlay, d = Math.max(0.05, Math.min(0.95, o.fitU[2])), u = Math.max(0.05, Math.min(0.95, o.fitV[2])), h = (p, y) => t[0] * p + t[1] * y + t[2] - 3, f = [
      a,
      h(a, r),
      r,
      i,
      h(i, r),
      r,
      i,
      h(i, l),
      l,
      a,
      h(a, l),
      l
    ];
    c.geometry.setIndex([0, 1, 2, 0, 2, 3]), c.geometry.setAttribute("position", new this.THREE.Float32BufferAttribute(f, 3)), c.geometry.setAttribute("uv", new this.THREE.Float32BufferAttribute([
      d,
      u,
      d,
      u,
      d,
      u,
      d,
      u
    ], 2)), c.geometry.computeVertexNormals(), c.geometry.computeBoundingSphere(), c.visible = !this.debugHideOceanBackings;
  }
  #L(e, t) {
    if (!e.replacement) {
      const c = el, d = new Float32Array(c * c * 3);
      e.replacement = {
        size: c,
        data: d,
        scratch: new Float32Array(c * c * 3),
        exactZ20Data: new Uint8Array(c * c),
        exactZ20Scratch: new Uint8Array(c * c),
        signature: "",
        coveredCells: 0
      };
    }
    const n = t.geometry, a = n.clone(), i = a.attributes.position, r = n.index ? n.index.array.slice() : Uint32Array.from({ length: i.count }, (c, d) => d), l = i.count > 65535 ? Uint32Array : Uint16Array, o = new l(r.length);
    o.set(r), a.setIndex(new this.THREE.BufferAttribute(o, 1)), a.setDrawRange(0, o.length), t.geometry = a, t.userData.convertedReplacementGeometry = !0, t.userData.convertedReplacementSourceIndex = r;
  }
  #g(e) {
    const t = performance.now();
    let n = 0, a = 0;
    for (const i of e.meshes) {
      const r = i.userData.convertedReplacementSourceIndex, l = i.geometry.index, o = i.geometry.attributes.position;
      if (!r || !l || !o) continue;
      const c = this.#N(e, i, r, o);
      let d = 0;
      const u = new Int32Array(c.cells.length);
      for (let h = 0; h < c.cells.length; h++) {
        const f = h * 3, p = c.cells[h];
        const y = Number.isFinite(e.oceanSurfaceY) && Math.abs(c.normalY[h]) >= 0.72 && Math.abs(c.centroidY[h] - e.oceanSurfaceY) <= 0.5;
        // Ocean classification keeps coarse geometry available for genuine
        // source holes, but it must not override an authoritative Z20 owner.
        // Suppress any horizontal coarse triangle whose complete footprint is
        // covered by exact Z20 data, including triangles close to sea level.
        // Requiring every footprint cell preserves the fallback along partial
        // shoreline coverage instead of opening water seams.
        let g = Math.abs(c.normalY[h]) >= 0.72 && c.footprintOffsets[h + 1] > c.footprintOffsets[h];
        if (g)
          for (let b = c.footprintOffsets[h]; b < c.footprintOffsets[h + 1]; b++) {
            const x = c.footprintCells[b];
            if (!e.replacement.exactZ20Data[x] || y && e.replacement.data[x * 3 + 1] <= 0.5) {
              g = !1;
              break;
            }
          }
        const b = !y && p >= 0 && this.#x(
          e.replacement,
          p,
          c.centroidY[h],
          c.normalY[h],
          e.zoom,
          !1
        ) || g;
        b ? g && (n++, y && a++) : (u[d / 3] = h, l.array[d++] = r[f], l.array[d++] = r[f + 1], l.array[d++] = r[f + 2]);
      }
      l.needsUpdate = !0, i.geometry.setDrawRange(0, d), i.userData.convertedReplacementRenderedSourceTriangles = u.slice(0, d / 3);
    }
    e.exactZ20SuppressedTriangles = n, e.exactZ20SuppressedOceanTriangles = a, this.metrics.replacementGeometryMs += performance.now() - t;
  }
  #N(e, t, n, a) {
    t.updateWorldMatrix(!0, !1);
    const i = e.coverageBounds ?? e.logicalBounds, r = t.matrixWorld.elements, l = t.userData.convertedReplacementTriangleClassification, o = l?.matrix?.every((M, S) => M === r[S]);
    if (l?.footprintOffsets && l.sourceIndex === n && l.position === a && l.positionVersion === a.version && o && l.minX === i.minX && l.maxX === i.maxX && l.minZ === i.minZ && l.maxZ === i.maxZ)
      return this.metrics.replacementClassificationHits++, l;
    const c = Math.floor(n.length / 3), d = new Int32Array(c);
    d.fill(-1);
    const u = new Float64Array(c), h = new Float64Array(c), f = new this.THREE.Vector3(), p = new this.THREE.Vector3(), y = new this.THREE.Vector3(), g = new this.THREE.Vector3(), b = new this.THREE.Vector3(), x = new this.THREE.Vector3(), m = e.replacement, v = i.maxX - i.minX, w = i.maxZ - i.minZ, T = new Uint32Array(c + 1), M = [];
    for (let S = 0; S < c; S++) {
      const R = S * 3;
      f.fromBufferAttribute(a, n[R]).applyMatrix4(t.matrixWorld), p.fromBufferAttribute(a, n[R + 1]).applyMatrix4(t.matrixWorld), y.fromBufferAttribute(a, n[R + 2]).applyMatrix4(t.matrixWorld), x.crossVectors(g.subVectors(p, f), b.subVectors(y, f)).normalize();
      const E = (f.x + p.x + y.x) / 3, O = (f.y + p.y + y.y) / 3, I = (f.z + p.z + y.z) / 3, A = v / m.size, F = w / m.size, k = Math.max(0, Math.floor((Math.min(f.x, p.x, y.x) - i.minX) / A)), C = Math.min(m.size - 1, Math.floor((Math.max(f.x, p.x, y.x) - i.minX) / A)), D = Math.max(0, Math.floor((Math.min(f.z, p.z, y.z) - i.minZ) / F)), G = Math.min(m.size - 1, Math.floor((Math.max(f.z, p.z, y.z) - i.minZ) / F));
      u[S] = O, h[S] = x.y, T[S] = M.length;
      if (k <= C && D <= G)
        for (let L = D; L <= G; L++)
          for (let j = k; j <= C; j++)
            gl(f.x, f.z, p.x, p.z, y.x, y.z, i.minX + (j + 0.5) * A, i.minZ + (L + 0.5) * F, A * 0.5, F * 0.5) && M.push(L * m.size + j);
      if (E < i.minX || E >= i.maxX || I < i.minZ || I >= i.maxZ) continue;
      const L = Math.max(0, Math.min(m.size - 1, Math.floor((E - i.minX) / v * m.size))), j = Math.max(0, Math.min(m.size - 1, Math.floor((I - i.minZ) / w * m.size)));
      d[S] = (j * m.size + L) * 3;
    }
    T[c] = M.length;
    const S = {
      sourceIndex: n,
      position: a,
      positionVersion: a.version,
      matrix: Float64Array.from(r),
      minX: i.minX,
      maxX: i.maxX,
      minZ: i.minZ,
      maxZ: i.maxZ,
      cells: d,
      centroidY: u,
      normalY: h,
      footprintOffsets: T,
      footprintCells: Uint16Array.from(M)
    };
    return t.userData.convertedReplacementTriangleClassification = S, this.metrics.replacementClassificationBuilds++, S;
  }
  #B(e) {
    const t = [...e].sort().join(",");
    if (t === this.replacementSelectionSignature) return;
    this.replacementSelectionSignature = t;
    const n = [...e].map((a) => this.models.get(a)).filter((a) => a?.visualReady && a.collisionEligible && a.projectedCoverage);
    const a = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Map();
    for (const r of n) {
      if (r.zoom !== 20 || !r.transitionParentId || r.oceanOnlyPage || r.oceanOnlyRefinement) continue;
      let l = i.get(r.transitionParentId);
      l == null && (l = this.#re(r.transitionParentId), i.set(r.transitionParentId, l)), l && a.add(r.id);
    }
    for (const r of n) {
      if (r.zoom >= 20 || !r.replacement) continue;
      const l = r.coverageBounds ?? r.logicalBounds, o = n.filter((f) => f.zoom > r.zoom && f.coverageBounds.maxX > l.minX && f.coverageBounds.minX < l.maxX && f.coverageBounds.maxZ > l.minZ && f.coverageBounds.minZ < l.maxZ), c = `${l.minX.toFixed(3)}/${l.maxX.toFixed(3)}/${l.minZ.toFixed(3)}/${l.maxZ.toFixed(3)}|${o.map((f) => `${f.id}:${f.clipOwnerId ?? ""}:${a.has(f.id) ? "exact" : "fallback"}`).sort().join(",")}`;
      if (r.replacement.signature === c) continue;
      const { data: d, scratch: u, exactZ20Data: h, exactZ20Scratch: f, size: p } = r.replacement;
      u.fill(0), f.fill(0);
      for (let y = 0; y < p * p; y++) u[y * 3 + 2] = -1 / 0;
      let y = 0;
      for (const g of o) {
        const b = g.projectedCoverage, x = b.bounds.maxX - b.bounds.minX, m = b.bounds.maxZ - b.bounds.minZ, v = b.coveredCellIndices ?? [...b.covered.keys()].filter((w) => b.covered[w]), w = a.has(g.id);
        for (const T of v) {
          const M = Math.floor(T / b.size), S = T - M * b.size, R = b.bounds.minX + (S + 0.5) / b.size * x, E = b.bounds.minZ + (M + 0.5) / b.size * m;
          if (R < l.minX || R >= l.maxX || E < l.minZ || E >= l.maxZ) continue;
          const O = Math.max(0, Math.min(p - 1, Math.floor((R - l.minX) / (l.maxX - l.minX) * p))), I = Math.max(0, Math.min(p - 1, Math.floor((E - l.minZ) / (l.maxZ - l.minZ) * p))), A = I * p + O, F = A * 3;
          u[F] < 0.5 && y++, u[F] = 1, b.horizontalCovered[T] && (u[F + 1] = 1, u[F + 2] = Math.max(u[F + 2], b.maximumHorizontalY[T])), w && (f[A] = 1);
        }
      }
      for (let g = 0; g < p * p; g++) Number.isFinite(u[g * 3 + 2]) || (u[g * 3 + 2] = 0);
      r.replacement.signature = c, r.replacement.coveredCells = y;
      let g = !1;
      for (let b = 0; b < d.length; b++)
        if (d[b] !== u[b]) {
          g = !0;
          break;
        }
      if (!g)
        for (let b = 0; b < h.length; b++)
          if (h[b] !== f[b]) {
            g = !0;
            break;
          }
      g && (d.set(u), h.set(f), this.#g(r), this.metrics.replacementRebuilds++);
    }
  }
  #d(e, t, n, a, i = 1) {
    const r = e?.replacement, l = e?.coverageBounds ?? e?.logicalBounds;
    if (!r || !l || t < l.minX || t >= l.maxX || n < l.minZ || n >= l.maxZ) return !1;
    const o = Math.max(0, Math.min(r.size - 1, Math.floor((t - l.minX) / (l.maxX - l.minX) * r.size))), d = (Math.max(0, Math.min(r.size - 1, Math.floor((n - l.minZ) / (l.maxZ - l.minZ) * r.size))) * r.size + o) * 3;
    return this.#x(r, d, a, i, e.zoom);
  }
  #x(e, t, n, a, i = 15, r = !0) {
    if (e.data[t] <= 0.5) return !1;
    if (r && e.exactZ20Data?.[t / 3]) return !0;
    const l = 1.5 + Math.min(2.5, Math.max(0, 20 - i) * 0.5);
    return Math.abs(a) < 0.72 || e.data[t + 1] > 0.5 && n <= e.data[t + 2] + l;
  }
  #j(e = this.now()) {
    if (!this.ownership) return;
    const t = /* @__PURE__ */ new Set(), n = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set();
    let i = !1;
    const r = (h) => {
      const f = oe(h);
      for (const p of [15, 16, 17]) {
        if (p > f.zoom) break;
        a.add(It(h, p));
      }
    };
    for (const h of [15, 16, 17]) {
      const f = this.layers.get(h);
      if (f?.activeTiles instanceof Set) {
        i = !0;
        const p = [...this.modelsByZoom.get(h)].filter((b) => f.activeTiles.has(b.tile)), y = [
          this.liveFocus,
          this.demandFocus,
          this.traversalTarget,
          ...this.coarseGuardFocuses
        ], g = fl(
          p,
          y,
          Bo[h]
        );
        for (const b of g)
          b.rendererActiveAt = e, r(b.id);
        if (this.liveFocus) for (const x of this.selected) {
          const b = this.models.get(x);
          if (b?.zoom !== h || e - b.rendererActiveAt > jo) continue;
          const bounds = b.coverageBounds ?? b.logicalBounds;
          Te(this.liveFocus, bounds) <= Uo[h] && r(b.id);
        }
      }
    }
    const l = /* @__PURE__ */ new Set(), o = this.resourceProfile === "constrained" ? 280 : this.roadFocusMode ? zo : this.detailFocusMode ? this.detailFocusRadius + hs : Es, c = (h) => !!this.liveFocus && Te(this.liveFocus, this.logicalBoundsForId(h)) <= o;
    // Loaded exact detail must not fall back to a coarse ancestor while it is
    // still in the camera. The former fixed 650 m retention circle caused a
    // visible z20 -> z17 -> z20 flash during flight and while reversing. Keep
    // camera-visible parents through a bounded, profile-aware distance, with a
    // little angular hysteresis at the frustum edge. This only retains detail
    // that was already selected; it does not fan out new city-wide requests.
    const localRetentionRadius = this.horizontalSpeed >= 80 ? 320 : this.horizontalSpeed >= 35 ? 500 : qo, viewDetailDistance = this.resourceProfile === "constrained" ? 700 : this.roadFocusMode ? this.horizontalSpeed >= 80 ? 900 : 1600 : this.locomotion === "flight" || this.locomotion === "glider" ? 2e3 : 1200, viewKeepsParent = (h) => {
      if (!this.viewPosition || !this.viewDirection) return !1;
      const f = this.logicalBoundsForId(h), p = (f.minX + f.maxX) * 0.5, y = (f.minZ + f.maxZ) * 0.5, g = p - this.viewPosition.x, b = y - this.viewPosition.z, x = Math.hypot(g, b), m = Math.hypot(f.maxX - f.minX, f.maxZ - f.minZ) * 0.5;
      if (x <= m || x > viewDetailDistance + m) return x <= m;
      const v = Math.max(1, this.camera?.aspect ?? 1), w = Math.max(20, Math.min(120, this.camera?.fov ?? 65)) * Math.PI / 180, T = Math.atan(Math.tan(w * 0.5) * v), M = Math.asin(Math.min(0.95, m / x)), S = Math.min(Math.PI * 0.49, T + M + 12 * Math.PI / 180);
      return (g * this.viewDirection.x + b * this.viewDirection.z) / x >= Math.cos(S);
    };
    this.activeDemand?.parentId && (l.add(this.activeDemand.parentId), r(this.activeDemand.parentId)), this.forwardDemand?.parentId && (l.add(this.forwardDemand.parentId), r(this.forwardDemand.parentId));
    for (const h of this.guardDemands)
      h?.parentId && (r(h.parentId), c(h.parentId) && l.add(h.parentId));
    for (const { demand: h } of this.recentDemands.values())
      h?.parentId && (r(h.parentId), c(h.parentId) && l.add(h.parentId));
    if (this.liveFocus && !this.detailSuppressed) {
      // Admission and retention use different radii. Once an exact transition
      // becomes visible, keep it selected through a wider band so walking or
      // reversing across the admission edge cannot alternate z17/z20 every
      // frame. The existing cache budget remains the hard memory bound.
      for (const h of this.selected) {
        const f = this.models.get(h), p = f?.zoom === 20 ? f.transitionParentId : null;
        p && (Te(this.liveFocus, this.logicalBoundsForId(p)) <= localRetentionRadius || viewKeepsParent(p)) && l.add(p);
      }
      for (const h of this.z20ParentResidentCounts.keys()) c(h) && l.add(h);
    }
    for (const h of this.leases.values())
      for (const f of h.ownerIds) {
        const p = oe(f);
        if (p.zoom === 20) {
          const y = It(f, 17);
          l.add(y);
          const g = this.ownership.transitions?.[y], b = g?.complete && this.#re(y) ? this.#le(y, g) : [f];
          for (const x of b) {
            const m = this.models.get(x);
            m?.visualReady && !m.oceanOnlyRefinement && n.add(x);
          }
        } else
          r(f), p.zoom === 17 && l.add(f);
      }
    for (const h of [
      this.prepareFocus,
      this.liveFocus,
      this.demandFocus,
      this.traversalTarget
    ])
      h && r(ye(h, 17));
    for (const h of this.modelsByZoom.get(15))
      h.visualReady && (!i || a.has(h.id)) && t.add(h.id);
    for (const h of n) t.add(h);
    const d = /* @__PURE__ */ new Set();
    for (const h of [15, 16, 17]) {
      const f = [];
      for (const p of t) this.models.get(p)?.zoom === h && f.push(p);
      for (const p of d) !t.has(p) && this.models.get(p)?.zoom === h && f.push(p);
      for (const p of f) {
        const y = this.ownership.transitions[p];
        if (!y?.complete) continue;
        const g = this.#le(p, y);
        if (i && y.childZoom < 20 && !g.some((x) => a.has(x)) || h === 17 && y.childZoom === 20 && (this.detailSuppressed || l.size && !l.has(p)) || !this.#re(p)) continue;
        const b = [];
        for (const x of g)
          this.models.get(x).oceanOnlyRefinement ? d.add(x) : b.push(x);
        const x = b.length !== g.length;
        !this.surfaceHoleFallback && !x && t.delete(p);
        for (const x of b) t.add(x);
      }
    }
    if (this.surfaceHoleFallback) for (const h of l) {
      const f = this.ownership.transitions?.[h];
      if (!(!f?.complete || f.childZoom !== 20 || !f.expected?.length || !this.#re(h)))
        for (const p of this.#le(h, f))
          this.models.get(p).oceanOnlyRefinement ? d.add(p) : t.add(p);
    }
    let u = t.size !== this.selected.size;
    if (!u)
      for (const h of t)
        if (!this.selected.has(h)) {
          u = !0;
          break;
        }
    let s = !1;
    if (!u)
      for (const h of t)
        if (!this.models.get(h)?.clipOwnerId) {
          s = !0;
          break;
        }
    if (u || s)
      for (const h of t) this.#ee(this.models.get(h), t);
    if (u) {
      const oldParents = /* @__PURE__ */ new Set(), newParents = /* @__PURE__ */ new Set();
      for (const h of this.selected) {
        const f = this.models.get(h);
        f?.zoom === 20 && f.transitionParentId && oldParents.add(f.transitionParentId);
      }
      for (const h of t) {
        const f = this.models.get(h);
        f?.zoom === 20 && f.transitionParentId && newParents.add(f.transitionParentId);
      }
      for (const h of oldParents) if (!newParents.has(h)) {
        const f = this.liveFocus ? Te(this.liveFocus, this.logicalBoundsForId(h)) : 1 / 0;
        const p = viewKeepsParent(h);
        f <= qo && p && this.metrics.nearDetailVisibilityDrops++, p && this.metrics.visibleDetailVisibilityDrops++, this.detailVisibilityHistory.set(h, { at: e, inCameraRetention: p }), this.metrics.lastDetailVisibilityChange = { parentId: h, action: "hidden", distanceMeters: f, localRetentionRadius, inCameraRetention: p, at: e };
      }
      for (const h of newParents) if (!oldParents.has(h)) {
        const f = this.detailVisibilityHistory.get(h), p = typeof f === "number" ? f : f?.at, y = typeof f === "number" || f?.inCameraRetention === !0;
        p != null && y && e - p <= Zo && (this.metrics.detailVisibilityReadds++, this.metrics.lastDetailVisibilityChange = { parentId: h, action: "readded", elapsedMs: e - p, at: e }), this.detailVisibilityHistory.delete(h);
      }
      for (const [h, f] of this.detailVisibilityHistory) e - (typeof f === "number" ? f : f?.at ?? -1 / 0) > Zo && this.detailVisibilityHistory.delete(h);
      this.#z(t);
    }
    this.surfaceHoleFallback && (u || !this.replacementSelectionSignature ? this.#B(t) : this.metrics.replacementNoopSkips++);
    const v = u ? new Set([...this.selected, ...t]) : t;
    for (const w of v) {
      const h = this.models.get(w);
      if (!h) continue;
      const f = !u || t.has(h.id);
      f ? (h.lastSelectedAt = e, h.selected || (h.selectedAt = e)) : h.selected && (h.hiddenAt = e), h.selected = f, h.scene.visible !== f && (h.scene.visible = f);
      if (h.oceanBacking) {
        const p = f && h.oceanOnlyFinePage && !this.debugHideOceanBackings;
        h.oceanBacking.mesh.visible !== p && (h.oceanBacking.mesh.visible = p);
      }
      if (h.companion) {
        const p = h.coverageBounds ?? h.logicalBounds, y = this.liveFocus && p ? Math.hypot(
          Math.max(p.minX - this.liveFocus.x, 0, this.liveFocus.x - p.maxX),
          Math.max(p.minZ - this.liveFocus.z, 0, this.liveFocus.z - p.maxZ)
        ) : 1 / 0, g = (this.locomotion === "flight" || this.locomotion === "glider") ? Da : h.companionWasVisible ? Ia : Oa, b = y <= g;
        let x = !1;
        if (h.zoom < 20) {
          const m = this.ownership.transitions?.[h.id];
          x = !!(m?.complete && m.expected?.length > 0 && this.#re(h.id));
        }
        const m = f && b && !x && !h.oceanOnlyPage && !this.debugHideSplats && !(this.debugHideSparseSplats && h.splatOnly) && !(this.debugHideCoarseSplats && h.zoom < 20) && this.altitudeAboveGround < 180;
        h.companion.visible !== m && (h.companion.visible = m), h.companionWasVisible = m;
      } else h.companionWasVisible = !1;
      h.companionDepth && (h.companionDepth.visible !== !!h.companion?.visible && (h.companionDepth.visible = !!h.companion?.visible)), h.sourceScene.visible && (h.sourceScene.visible = !1);
    }
    if (this.selected = t, u) {
      this.metrics.handoffs++;
      for (const h of this.leases.values()) {
        const f = this.#y(h.x, h.z);
        if (!f.length) continue;
        const p = f.map((b) => b.id), y = new Set(h.ownerIds), g = new Set(p);
        for (const b of y) {
          if (g.has(b)) continue;
          const x = this.models.get(b);
          x && (x.pinCount = Math.max(0, x.pinCount - 1));
        }
        for (const b of f) y.has(b.id) || b.pinCount++;
        h.ownerIds = p;
      }
    }
  }
  #U() {
    const e = this.layers.get(20);
    if (!e) return;
    const t = this.activeDemandContentIds, n = this.now(), a = this.liveFocus ?? this.focus ?? this.demandFocus, i = e.lruCache?.isFull?.() ?? !1;
    if (i) {
      let r = 0;
      for (const l of [...e.lruCache?.itemSet?.keys?.() ?? []]) {
        const o = Ge(l);
        if (!o || !l.internal?.hasRenderableContent || l.internal.loadingState !== 4 || this.models.has(o)) continue;
        e.lruCache.remove(l), this.metrics.ghostTileRepairs++;
        if (++r >= 64) break;
      }
    }
    for (const r of this.modelsByZoom.get(20)) {
      if (r.selected || r.pinCount > 0 || t.has(r.id)) continue;
      const l = a && r.bounds ? Math.max(r.bounds.min.x - a.x, 0, a.x - r.bounds.max.x) : 1 / 0, o = a && r.bounds ? Math.max(r.bounds.min.z - a.z, 0, a.z - r.bounds.max.z) : 1 / 0;
      if (!this.detailFocusMode && !i && (Math.hypot(l, o) <= qo || n - r.lastSelectedAt <= Zo)) {
        e.lruCache?.markUsed?.(r.tile);
        continue;
      }
      e.lruCache?.remove?.(r.tile);
    }
  }
  #H() {
    if (!this.prepareFocus) return;
    const e = new Set([15, 16, 17].map((t) => ye(this.prepareFocus, t)));
    for (const t of [this.activeDemand, this.forwardDemand, ...this.guardDemands])
      if (t?.parentId)
        for (const n of [15, 16, 17]) e.add(It(t.parentId, n));
    for (const t of [15, 16, 17]) {
      const n = this.layers.get(t);
      for (const a of [...this.modelsByZoom.get(t)])
        a.selected || a.pinCount > 0 || e.has(a.id) || a.projectedCoverageState === "building" || n.lruCache?.has?.(a.tile) && n.lruCache.remove(a.tile);
    }
  }
  #y(e, t) {
    const n = this.#n(e, t);
    if (!n) return [];
    const a = this.models.get(n.tileId);
    if (!a) return [];
    if (a.zoom === 20) {
      const i = a.transitionParentId;
      return (this.ownership.transitions?.[i]?.expected ?? [a.id]).map((l) => this.models.get(l)).filter((l) => l?.selected);
    }
    return [a];
  }
  #G(e, t, n) {
    const a = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
      [Math.SQRT1_2, Math.SQRT1_2],
      [Math.SQRT1_2, -Math.SQRT1_2],
      [-Math.SQRT1_2, Math.SQRT1_2],
      [-Math.SQRT1_2, -Math.SQRT1_2]
    ];
    for (let i = 10; i <= n + 1e-6; i += 10)
      for (const [r, l] of a) {
        const o = e + r * i, c = t + l * i;
        if (this.surfaceAt(o, c)) return { x: o, z: c };
      }
    return null;
  }
  #v(e) {
    if (this.texturePixels.has(e)) return this.texturePixels.get(e);
    const t = e.image, n = t?.naturalWidth ?? t?.videoWidth ?? t?.width, a = t?.naturalHeight ?? t?.videoHeight ?? t?.height;
    if (!n || !a)
      return this.texturePixels.set(e, null), null;
    if (t.data && ArrayBuffer.isView(t.data)) {
      const i = { width: n, height: a, data: t.data };
      return this.texturePixels.set(e, i), i;
    }
    try {
      const i = document.createElement("canvas");
      i.width = n, i.height = a;
      const r = i.getContext("2d", { willReadFrequently: !0 });
      r.drawImage(t, 0, 0, n, a);
      const l = { width: n, height: a, data: r.getImageData(0, 0, n, a).data };
      return this.texturePixels.set(e, l), l;
    } catch {
      return this.texturePixels.set(e, null), null;
    }
  }
  #V(e) {
    const t = this.#v(e);
    if (!t?.data || !t.width || !t.height)
      throw new Error("Source car texture is not CPU-readable; overlay transaction cannot commit safely");
    const n = new Uint8Array(t.data.length);
    n.set(t.data);
    const a = new this.THREE.DataTexture(
      n,
      t.width,
      t.height,
      this.THREE.RGBAFormat,
      this.THREE.UnsignedByteType
    );
    return a.name = `${e.name || "apple-r3d-source"}-overlay-owned`, a.colorSpace = e.colorSpace, a.flipY = e.flipY, a.wrapS = e.wrapS, a.wrapT = e.wrapT, a.magFilter = e.magFilter, a.minFilter = e.minFilter, a.generateMipmaps = e.generateMipmaps, a.anisotropy = e.anisotropy, a.channel = e.channel, a.userData = {
      ...e.userData,
      convertedSessionOwned: !0,
      overlayIndependentPixels: !0,
      // Overlay extraction owns decoded RGBA pixels; retaining another copy of
      // the source JPEG does not affect its exact colors or later cutouts.
      sourceTextureBytes: null
    }, a.needsUpdate = !0, a;
  }
  #X(e, t, n) {
    const a = new Set(e), i = Math.max(0, Number(n) || 0);
    for (const o of this.models.values()) {
      if (o.zoom !== 20 || !o.visualReady || !o.bounds) continue;
      const c = {
        minX: o.bounds.min.x,
        maxX: o.bounds.max.x,
        minZ: o.bounds.min.z,
        maxZ: o.bounds.max.z
      };
      Te({ x: t[0], z: t[2] }, c) <= i && a.add(o.id);
    }
    const r = [...a].filter((o) => this.models.has(o));
    for (const o of r) this.models.get(o).pinCount++;
    let l = !1;
    return {
      ownerIds: r,
      get released() {
        return l;
      },
      release: () => {
        if (!l) {
          l = !0;
          for (const o of r) {
            const c = this.models.get(o);
            c && (c.pinCount = Math.max(0, c.pinCount - 1));
          }
        }
      }
    };
  }
  async #q(e, t, { signal: n, timeoutMs: a }) {
    if (!e.length) return;
    const i = this.now(), r = { x: t[0], y: t[1], z: t[2] };
    for (; this.now() - i < a; ) {
      if (Ze(n), !e.filter((c) => !this.models.get(c)?.visualReady).length) return;
      this.update({ priority: r, player: { position: r, velocity: { x: 0, y: 0, z: 0 } }, altitudeAboveGround: 0, locomotion: "walk" }), await Zn(16, n);
    }
    const l = e.filter((o) => !this.models.get(o)?.visualReady);
    throw new Error(`Timed out retaining source car pages: ${l.join(", ")}`);
  }
  #h(e) {
    const t = this.models.get(e.sourceTileKey);
    if (!t || t.zoom !== 20) return null;
    const n = t.tile.extras?.source?.primitiveMapping ?? t.tile.extras?.primitiveMapping, a = t.tile.extras?.source?.sourceTriangleMapping ?? n?.mappingVersion ?? rt;
    if (a !== rt || n?.sourceTriangleToPrimitiveTriangle !== "identity") return null;
    const i = n?.primitiveIndex ?? 0, r = t.sourceIndices[i];
    return !r || !Number.isInteger(e.sourceTriangleIndex) || e.sourceTriangleIndex < 0 || e.sourceTriangleIndex * 3 + 2 >= r.length ? null : {
      ...e,
      contentId: t.id,
      primitiveIndex: i,
      triangleIndex: e.sourceTriangleIndex,
      sourceMappingVersion: a,
      vertexUvMaterialCorrespondence: !0
    };
  }
  #Z(e, t, n = t) {
    const a = new this.THREE.Group();
    a.visible = !1, a.userData.convertedSessionOwned = !0;
    const i = /* @__PURE__ */ new Map();
    for (const p of n) {
      const y = `${p.contentId}:${p.primitiveIndex}`;
      i.has(y) || i.set(y, []), i.get(y).push(p);
    }
    const l = (Number(e.sourceCaptureHeading ?? e.heading ?? -Math.PI / 2 - (Number(e.headingRadians) || 0)) || 0) + Math.PI, o = Math.cos(l), c = Math.sin(l), d = new this.THREE.Vector3(), u = new this.THREE.Vector3();
    let h = 0;
    const f = [];
    for (const p of i.values()) {
      const y = p[0], g = this.models.get(y.contentId), b = g?.meshes[y.primitiveIndex], x = g?.sourceIndices[y.primitiveIndex], m = b?.geometry?.attributes?.position;
      if (!b || !x || !m) continue;
      b.updateWorldMatrix(!0, !1);
      const v = b.geometry.attributes.uv, w = b.geometry.attributes.normal, T = new this.THREE.Matrix3().getNormalMatrix(b.matrixWorld), M = [], S = [], R = [], E = t.filter((P) => P.contentId === y.contentId && P.primitiveIndex === y.primitiveIndex).map((P) => P.triangleIndex), O = [];
      for (let P = 0; P < x.length / 3; P++) {
        const V = P * 3, X = [x[V], x[V + 1], x[V + 2]].map((U) => d.fromBufferAttribute(m, U).applyMatrix4(b.matrixWorld).clone()), Q = X.map((U) => U.y - Ae(e, U.x, U.z));
        Math.max(...Q) < 0.14 || !Wn(e, X) || !Kn(X) || bs(e, X).length < 3 || O.push({
          triangleIndex: P,
          vertexKeys: X.map(Al),
          bounds: {
            minX: Math.min(...X.map((U) => U.x)),
            minY: Math.min(...X.map((U) => U.y)),
            minZ: Math.min(...X.map((U) => U.z)),
            maxX: Math.max(...X.map((U) => U.x)),
            maxY: Math.max(...X.map((U) => U.y)),
            maxZ: Math.max(...X.map((U) => U.z))
          },
          maxRoadHeight: Math.max(...Q)
        });
      }
      const I = new Map(O.map((P) => [P.triangleIndex, P])), A = p.map((P) => P.triangleIndex).filter((P) => (I.get(P)?.maxRoadHeight ?? -1 / 0) >= 0.18), F = Tl(O, [...E, ...A], {
        authoritativeSeedTriangleIndices: E,
        targetCenter: e.center
      }), k = {
        contentId: y.contentId,
        primitiveIndex: y.primitiveIndex,
        sourceTriangleCount: x.length / 3,
        candidateCount: O.length,
        authoritativeSeedCount: E.length,
        survivingAuthoritativeSeedCount: E.filter((P) => I.has(P)).length,
        elevatedRemovalSeedCount: A.length,
        selectedTriangleCount: F.length,
        emittedTriangleCount: 0
      };
      if (f.push(k), !F.length) continue;
      for (const P of F) {
        const V = P * 3;
        if (V < 0 || V + 2 >= x.length) continue;
        const Z = [x[V], x[V + 1], x[V + 2]], Q = Z.map((Y) => d.fromBufferAttribute(m, Y).applyMatrix4(b.matrixWorld).clone()).map((Y, z) => {
          const q = Z[z], ee = { x: Y.x, y: Y.y, z: Y.z };
          return v && (ee.u = v.getX(q), ee.v = v.getY(q)), w && (u.fromBufferAttribute(w, q).applyMatrix3(T).normalize(), ee.nx = u.x, ee.ny = u.y, ee.nz = u.z), ee;
        }), U = bs(e, Q);
        if (!(U.length < 3)) {
          h += U.length - 2, k.emittedTriangleCount += U.length - 2;
          for (let Y = 1; Y < U.length - 1; Y++) for (const z of [U[0], U[Y], U[Y + 1]]) {
            const q = z.x - e.center[0], ee = z.y - Ae(e, z.x, z.z), J = z.z - e.center[2];
            if (M.push(o * q - c * J, ee, c * q + o * J), v && S.push(z.u, z.v), w) {
              const te = Math.hypot(z.nx, z.ny, z.nz) || 1, Ie = z.nx / te, Ne = z.ny / te, me = z.nz / te;
              R.push(o * Ie - c * me, Ne, c * Ie + o * me);
            }
          }
        }
      }
      if (!M.length) continue;
      const C = Ml(M, S, R, {
        enabled: e.visualApproved !== !0 && e.manualBoundsReviewed !== !0
      });
      h += C.positions.length / 9 - k.emittedTriangleCount, k.symmetry = {
        mirrored: C.mirrored,
        dominantSide: C.dominantSide ?? null,
        sourceSideCounts: C.sourceSideCounts,
        centerTriangleCount: C.centerTriangleCount ?? null
      }, k.emittedTriangleCount = C.positions.length / 9;
      const D = Array.isArray(b.material) ? b.material[0] : b.material, G = D.map ? this.#V(D.map) : null, L = new this.THREE.BufferGeometry();
      L.setAttribute("position", new this.THREE.Float32BufferAttribute(C.positions, 3)), C.uvs.length && L.setAttribute("uv", new this.THREE.Float32BufferAttribute(C.uvs, 2)), C.normals.length ? L.setAttribute("normal", new this.THREE.Float32BufferAttribute(C.normals, 3)) : L.computeVertexNormals();
      const j = D.clone();
      j.clippingPlanes = null, G && (j.map = G), j.customProgramCacheKey = () => `converted-source-car-${e.id}-${y.contentId}-${y.primitiveIndex}`;
      const N = new this.THREE.Mesh(L, j);
      N.userData.convertedSessionOwned = !0, N.renderOrder = 6, a.add(N);
    }
    return a.userData.source = e.id, a.userData.sourceTriangles = h, a.userData.auditedSourceTriangles = t.length, a.userData.sourceMappingVersion = rt, a.userData.sourceCarExtractionAudit = {
      targetId: e.id,
      sourceRefCount: t.length,
      removalRefCount: n.length,
      emittedTriangleCount: h,
      groups: f
    }, a;
  }
  #W(e, t, n) {
    if (t === n || !Array.isArray(t?.proxyColor)) {
      e.userData.targetColorApplied = !1;
      return;
    }
    const a = t.proxyColor.map((o) => Math.max(0, Math.min(255, Number(o) || 0))), i = Array.isArray(n.proxyColor) ? n.proxyColor.map((o) => Math.max(1, Math.min(255, Number(o) || 1))) : [128, 128, 128], r = a.map((o, c) => Math.max(0.24, Math.min(1.7, o / i[c]))), l = new this.THREE.Color(r[0], r[1], r[2]);
    e.traverse((o) => {
      if (!o.isMesh) return;
      const c = Array.isArray(o.material) ? o.material : [o.material];
      for (const d of c) d?.color?.multiply(l);
    }), e.userData.targetColorApplied = !0, e.userData.targetColorMultiplier = r, e.userData.targetProxyColor = [...t.proxyColor];
  }
  #ne(e, t, n) {
    const i = (Number(e.heading ?? -Math.PI / 2 - (Number(e.headingRadians) || 0)) || 0) + Math.PI, r = Math.cos(i), l = Math.sin(i), o = [], c = [], d = [], u = [], h = [];
    let f = 0;
    for (const x of t) {
      const v = this.models.get(x)?.companion, w = v?.geometry, T = !!w?.userData?.packedSplats, M = w?.getAttribute?.("position"), S = T ? w.getAttribute("splatPosition0") : null, R = T ? w.getAttribute("splatPosition1") : null, E = T ? w.getAttribute("splatPosition2") : null, O = T ? w.getAttribute("splatColor") : w?.getAttribute?.("color"), I = T ? w.getAttribute("splatAlpha") : w?.getAttribute?.("alpha"), A = T ? null : w?.getAttribute?.("barycentric"), F = T ? w.getAttribute("splatKind") : w?.getAttribute?.("kind"), k = T ? w.getAttribute("splatEnabled") : null;
      if (!v || (T ? !S || !R || !E || !O || !I : !M || !O || !I || !A)) continue;
      v.updateWorldMatrix(!0, !1);
      const C = new this.THREE.Vector3(), D = T ? S.count : M.count / 3, G = Number(w.userData.positionScale) || 1, L = new this.THREE.Vector3(...(w.userData.positionOffset ?? [0, 0, 0]));
      for (let j = 0; j < D; j++) {
        if (T && k?.getX(j) < 0.5) continue;
        const N = [0, 1, 2].map((P) => (C.fromBufferAttribute(T ? [S, R, E][P] : M, T ? j : j * 3 + P), T && C.set(Math.fround(C.x * G + L.x), Math.fround(C.y * G + L.y), Math.fround(C.z * G + L.z)), C.applyMatrix4(v.matrixWorld).clone()));
        if (!Wn(e, N, 1.1, 1) || !Kn(N, 4.9, 5.5)) continue;
        const P = N.map((V, q) => {
          const ee = T ? j : j * 3 + q;
          return {
            x: V.x,
            y: V.y,
            z: V.z,
            cr: O.getX(ee),
            cg: O.getY(ee),
            cb: O.getZ(ee),
            alpha: I.getX(ee),
            bx: T ? q === 0 ? 1 : 0 : A.getX(ee),
            by: T ? q === 1 ? 1 : 0 : A.getY(ee),
            bz: T ? q === 2 ? 1 : 0 : A.getZ(ee),
            kind: F?.getX(ee) ?? 0
          };
        }), V = bs(e, P);
        if (!(V.length < 3)) {
          f += V.length - 2;
          for (let q = 1; q < V.length - 1; q++) for (const ee of [V[0], V[q], V[q + 1]]) {
            const J = ee.x - e.center[0], te = ee.y - Ae(e, ee.x, ee.z), Ie = ee.z - e.center[2];
            o.push(r * J - l * Ie, te, l * J + r * Ie), c.push(ee.cr, ee.cg, ee.cb), d.push(ee.alpha), u.push(ee.bx, ee.by, ee.bz), h.push(ee.kind);
          }
        }
      }
    }
    if (n.userData.sourceSplatTriangles = 0, !f) return 0;
    const p = new this.THREE.BufferGeometry();
    p.setAttribute("position", new this.THREE.Float32BufferAttribute(o, 3)), p.setAttribute("color", new this.THREE.Float32BufferAttribute(c, 3)), p.setAttribute("alpha", new this.THREE.Float32BufferAttribute(d, 1)), p.setAttribute("barycentric", new this.THREE.Float32BufferAttribute(u, 3)), p.setAttribute("kind", new this.THREE.Float32BufferAttribute(h, 1));
    const y = [...t].map((x) => {
      const m = this.models.get(x)?.companion;
      return m?.userData?.legacySplatMaterial ?? m?.material;
    }).find(Boolean);
    if (!y)
      return p.dispose(), 0;
    const g = y.clone();
    g.clippingPlanes = null;
    const b = new this.THREE.Mesh(p, g);
    return b.userData.convertedSessionOwned = !0, b.userData.sourceCarSplats = !0, b.renderOrder = 7, n.add(b), n.userData.sourceSplatTriangles = f, f;
  }
  #K(e) {
    const t = [], n = new this.THREE.Vector3();
    e.updateMatrixWorld(!0);
    for (const f of e.children) {
      const p = f.geometry?.getAttribute?.("position");
      if (p)
        for (let y = 0; y < p.count; y++)
          n.fromBufferAttribute(p, y).applyMatrix4(f.matrix), t.push([n.x, n.z]);
    }
    if (t.length < 3) return 0;
    const a = t.reduce((f, p) => f + p[0], 0) / t.length, i = t.reduce((f, p) => f + p[1], 0) / t.length;
    let r = 0, l = 0, o = 0;
    for (const [f, p] of t) {
      const y = f - a, g = p - i;
      r += y * y, l += g * g, o += y * g;
    }
    const c = 0.5 * Math.atan2(2 * o, r - l);
    let d = Math.atan2(Math.sin(-Math.atan2(Math.cos(c), Math.sin(c))), Math.cos(-Math.atan2(Math.cos(c), Math.sin(c))));
    if (d > Math.PI / 2 && (d -= Math.PI), d < -Math.PI / 2 && (d += Math.PI), Math.abs(d) < 1e-4) return 0;
    const u = new this.THREE.Group();
    u.userData.convertedSessionOwned = !0, u.userData.sourceCarAxisAlignment = !0, u.rotation.y = d;
    const h = [...e.children];
    for (const f of h) u.add(f);
    return e.add(u), e.userData.axisCorrection = d, d;
  }
  #r(e, { rebuildCoverage: t = !0 } = {}) {
    if (!e || e.zoom !== 20) return;
    const n = /* @__PURE__ */ new Map();
    for (const i of this.carOverlays.values())
      for (const r of i.removalRefs ?? [])
        r.contentId === e.id && (n.has(r.primitiveIndex) || n.set(r.primitiveIndex, /* @__PURE__ */ new Set()), n.get(r.primitiveIndex).add(r.triangleIndex));
    let a = 0;
    for (let i = 0; i < e.meshes.length; i++) {
      const r = e.meshes[i], l = e.sourceGeometries?.[i] ?? r.geometry, o = e.sourceIndices[i], c = n.get(i) ?? /* @__PURE__ */ new Set();
      if (!c.size) {
        r.userData.convertedSuppressionGeometry && (r.geometry.dispose(), r.geometry = l, delete r.userData.convertedSuppressionGeometry);
        continue;
      }
      r.userData.convertedSuppressionGeometry || (r.geometry = l.clone(), r.userData.convertedSuppressionGeometry = !0);
      const d = o.constructor, u = new d(o.length);
      let h = 0;
      for (let f = 0; f * 3 + 2 < o.length; f++) {
        if (c.has(f)) {
          a++;
          continue;
        }
        const p = f * 3;
        u[h++] = o[p], u[h++] = o[p + 1], u[h++] = o[p + 2];
      }
      r.geometry.setIndex(new this.THREE.BufferAttribute(u, 1)), r.geometry.setDrawRange(0, h), r.geometry.index.needsUpdate = !0;
    }
    e.suppressedTriangleCount = a, t && e.collisionEligible && e.coverageBounds && (this.projectedCoverageJobs.delete(e.id), e.projectedCoverageGeneration++, e.projectedCoverage = ul(this.THREE, e.meshes, e.coverageBounds), e.projectedCoverageState = e.projectedCoverage ? "ready" : "failed", this.#e(e), e.selected && (this.replacementSelectionSignature = ""));
  }
  #f(e, t, n = 1e4) {
    for (const a of this.carOverlays.values()) {
      if (!a.patchAttached || !a.patch?.visible) continue;
      const i = a.spec.roadPatchPolygonXZ ?? a.spec.removalMask?.polygonXZ ?? a.spec.roadInfill?.polygonXZ;
      if (!ms(e, t, i)) continue;
      const r = Ae(a.spec, e, t) + 0.025;
      if (r > n) continue;
      const l = a.spec.roadInfill?.plane, [o = 0, c = 0] = l?.valid ? l.coefficientsYeqAxPlusBzPlusC : [], d = new this.THREE.Vector3(-o, 1, -c).normalize();
      return {
        tileId: `overlay:car:${a.id}`,
        overlayId: a.id,
        sourceZoom: 20,
        rendered: !0,
        collisionOnly: !1,
        point: { x: e, y: r, z: t },
        normal: { x: d.x, y: d.y, z: d.z },
        distance: n - r
      };
    }
    return null;
  }
  #Y(e, t, n, a) {
    let i = null;
    for (const r of this.carOverlays.values()) {
      if (!r.patchAttached || !r.patch?.visible) continue;
      const l = r.spec.roadInfill?.plane, [o = 0, c = 0, d = Ae(r.spec)] = l?.valid ? l.coefficientsYeqAxPlusBzPlusC : [0, 0, Ae(r.spec)], u = t.y - o * t.x - c * t.z;
      if (Math.abs(u) < 1e-8) continue;
      const h = (o * e.x + c * e.z + d + 0.025 - e.y) / u;
      if (h < n || h > a || i && h >= i.distance) continue;
      const f = e.x + t.x * h, p = e.z + t.z * h, y = r.spec.roadPatchPolygonXZ ?? r.spec.removalMask?.polygonXZ ?? r.spec.roadInfill?.polygonXZ;
      if (!ms(f, p, y)) continue;
      const g = new this.THREE.Vector3(-o, 1, -c).normalize();
      i = {
        tileId: `overlay:car:${r.id}`,
        overlayId: r.id,
        sourceZoom: 20,
        rendered: !0,
        collisionOnly: !1,
        point: { x: f, y: e.y + t.y * h, z: p },
        normal: { x: g.x, y: g.y, z: g.z },
        distance: h
      };
    }
    return i;
  }
  #w(e, t) {
    const n = t.geometry, a = n?.attributes?.position;
    if (!a) return null;
    const i = n.index, r = Math.max(0, n.drawRange?.start ?? 0), l = i?.count ?? a.count, o = Math.max(0, Math.min(
      Number.isFinite(n.drawRange?.count) ? n.drawRange.count : l,
      l - r
    )), c = e.coverageBounds ?? e.logicalBounds;
    t.updateWorldMatrix(!0, !1);
    const d = t.matrixWorld.elements, u = t.userData.convertedVerticalRayIndex, h = u?.matrix?.every((E, O) => E === d[O]);
    if (u && u.geometry === n && u.position === a && u.positionVersion === a.version && u.index === i && u.indexVersion === (i?.version ?? -1) && u.start === r && u.count === o && h && u.minX === c.minX && u.maxX === c.maxX && u.minZ === c.minZ && u.maxZ === c.maxZ)
      return u;
    const f = performance.now(), p = c.maxX - c.minX, y = c.maxZ - c.minZ;
    if (!(p > 0) || !(y > 0)) return null;
    const g = Math.floor(o / 3), b = Math.max(20, Math.min(256, Math.ceil(Math.sqrt(g / 2)))), x = new Float32Array(g * 9), m = new Int32Array(g), v = new Array(b * b), w = new this.THREE.Vector3(), T = new this.THREE.Vector3(), M = new this.THREE.Vector3();
    let S = 0;
    for (let E = r; E + 2 < r + o; E += 3) {
      const O = i ? i.getX(E) : E, I = i ? i.getX(E + 1) : E + 1, A = i ? i.getX(E + 2) : E + 2;
      w.fromBufferAttribute(a, O).applyMatrix4(t.matrixWorld), T.fromBufferAttribute(a, I).applyMatrix4(t.matrixWorld), M.fromBufferAttribute(a, A).applyMatrix4(t.matrixWorld);
      const F = Math.min(w.x, T.x, M.x), k = Math.max(w.x, T.x, M.x), C = Math.min(w.z, T.z, M.z), D = Math.max(w.z, T.z, M.z);
      if (k < c.minX || F >= c.maxX || D < c.minZ || C >= c.maxZ) continue;
      const G = S * 9;
      x.set([w.x, w.y, w.z, T.x, T.y, T.z, M.x, M.y, M.z], G), m[S] = Math.floor(E / 3);
      const L = Math.max(0, Math.min(b - 1, Math.floor((F - c.minX) / p * b))), j = Math.max(0, Math.min(b - 1, Math.floor((k - c.minX) / p * b))), N = Math.max(0, Math.min(b - 1, Math.floor((C - c.minZ) / y * b))), P = Math.max(0, Math.min(b - 1, Math.floor((D - c.minZ) / y * b)));
      for (let V = N; V <= P; V++) for (let Z = L; Z <= j; Z++) {
        const X = c.minX + Z / b * p, Q = c.minX + (Z + 1) / b * p, U = c.minZ + V / b * y, Y = c.minZ + (V + 1) / b * y, z = (X + Q) * 0.5, q = (U + Y) * 0.5, ee = (Q - X) * 0.5, J = (Y - U) * 0.5;
        if (!gl(
          w.x,
          w.z,
          T.x,
          T.z,
          M.x,
          M.z,
          z,
          q,
          ee,
          J
        )) continue;
        const te = V * b + Z;
        v[te] ? v[te].push(S) : v[te] = [S];
      }
      S++;
    }
    const R = {
      geometry: n,
      position: a,
      positionVersion: a.version,
      index: i,
      indexVersion: i?.version ?? -1,
      start: r,
      count: o,
      matrix: Float64Array.from(d),
      minX: c.minX,
      maxX: c.maxX,
      minZ: c.minZ,
      maxZ: c.maxZ,
      size: b,
      triangles: S === g ? x : x.slice(0, S * 9),
      faceIndices: S === g ? m : m.slice(0, S),
      bins: v
    };
    return t.userData.convertedVerticalRayIndex = R, this.metrics.verticalIndexBuilds++, this.metrics.verticalIndexBuildMs += performance.now() - f, R;
  }
  #Q(e, t, n, a, i, r, l) {
    const o = this.#w(e, t);
    if (!o || n < o.minX || n >= o.maxX || a < o.minZ || a >= o.maxZ) return null;
    const c = Math.max(0, Math.min(o.size - 1, Math.floor((n - o.minX) / (o.maxX - o.minX) * o.size))), d = Math.max(0, Math.min(o.size - 1, Math.floor((a - o.minZ) / (o.maxZ - o.minZ) * o.size)));
    let u = null;
    for (const h of o.bins[d * o.size + c] ?? []) {
      const f = h * 9, p = o.triangles[f], y = o.triangles[f + 1], g = o.triangles[f + 2], b = o.triangles[f + 3], x = o.triangles[f + 4], m = o.triangles[f + 5], v = o.triangles[f + 6], w = o.triangles[f + 7], T = o.triangles[f + 8], M = (m - T) * (p - v) + (v - b) * (g - T);
      if (Math.abs(M) < 1e-10) continue;
      const S = ((m - T) * (n - v) + (v - b) * (a - T)) / M, R = ((T - g) * (n - v) + (p - v) * (a - T)) / M, E = 1 - S - R;
      if (S < -1e-6 || R < -1e-6 || E < -1e-6) continue;
      const O = S * y + R * x + E * w, I = i - O;
      if (I < r || I > l || u && I >= u.distance) continue;
      const A = b - p, F = x - y, k = m - g, C = v - p, D = w - y, G = T - g;
      let L = F * G - k * D, j = k * C - A * G, N = A * D - F * C;
      const P = Math.hypot(L, j, N) || 1;
      L /= P, j /= P, N /= P, !this.#d(e, n, a, O, j) && (u = {
        tileId: e.id,
        sourceZoom: e.zoom,
        oceanOnly: !!e.oceanOnlyPage,
        oceanSurfaceY: Number.isFinite(e.oceanSurfaceY) ? e.oceanSurfaceY : null,
        rendered: !0,
        collisionOnly: !1,
        point: { x: n, y: O, z: a },
        normal: { x: L, y: j, z: N },
        distance: I,
        primitiveIndex: e.meshes.indexOf(t),
        triangleIndex: o.faceIndices[h]
      });
    }
    return u && this.metrics.verticalIndexHits++, u;
  }
  #J(e, t, n) {
    const a = this.#w(e, t);
    if (!a || !Number.isFinite(n.far)) return null;
    const i = n.ray.origin, r = n.ray.direction, l = n.near, o = n.far, c = i.x + r.x * o, d = i.z + r.z * o, u = a.maxX - a.minX, h = a.maxZ - a.minZ, f = (S, R, E) => Math.max(0, Math.min(
      a.size - 1,
      Math.floor((S - R) / E * a.size)
    )), p = Math.max(a.minX, Math.min(i.x, c)), y = Math.min(a.maxX - Number.EPSILON, Math.max(i.x, c)), g = Math.max(a.minZ, Math.min(i.z, d)), b = Math.min(a.maxZ - Number.EPSILON, Math.max(i.z, d));
    if (p > y || g > b) return null;
    const x = f(p, a.minX, u), m = f(y, a.minX, u), v = f(g, a.minZ, h), w = f(b, a.minZ, h), T = /* @__PURE__ */ new Set();
    for (let S = v; S <= w; S++) for (let R = x; R <= m; R++)
      for (const E of a.bins[S * a.size + R] ?? []) T.add(E);
    let M = null;
    for (const S of T) {
      const R = S * 9, E = a.triangles[R], O = a.triangles[R + 1], I = a.triangles[R + 2], A = a.triangles[R + 3] - E, F = a.triangles[R + 4] - O, k = a.triangles[R + 5] - I, C = a.triangles[R + 6] - E, D = a.triangles[R + 7] - O, G = a.triangles[R + 8] - I, L = r.y * G - r.z * D, j = r.z * C - r.x * G, N = r.x * D - r.y * C, P = A * L + F * j + k * N;
      if (Math.abs(P) < 1e-10) continue;
      const V = 1 / P, Z = i.x - E, X = i.y - O, Q = i.z - I, U = (Z * L + X * j + Q * N) * V;
      if (U < -1e-7 || U > 1 + 1e-7) continue;
      const Y = X * k - Q * F, z = Q * A - Z * k, q = Z * F - X * A, ee = (r.x * Y + r.y * z + r.z * q) * V;
      if (ee < -1e-7 || U + ee > 1 + 1e-7) continue;
      const J = (C * Y + D * z + G * q) * V;
      if (J < l || J > o || M && J >= M.distance) continue;
      const te = i.x + r.x * J, Ie = i.y + r.y * J, Ne = i.z + r.z * J;
      let me = F * G - k * D, De = k * C - A * G, Pe = A * D - F * C;
      const Be = Math.hypot(me, De, Pe) || 1;
      me /= Be, De /= Be, Pe /= Be, !this.#d(e, te, Ne, Ie, De) && (M = {
        tileId: e.id,
        sourceZoom: e.zoom,
        oceanOnly: !!e.oceanOnlyPage,
        oceanSurfaceY: Number.isFinite(e.oceanSurfaceY) ? e.oceanSurfaceY : null,
        rendered: !0,
        collisionOnly: !1,
        point: { x: te, y: Ie, z: Ne },
        normal: { x: me, y: De, z: Pe },
        distance: J,
        primitiveIndex: e.meshes.indexOf(t),
        triangleIndex: a.faceIndices[S]
      });
    }
    return M && this.metrics.shortRayIndexHits++, M;
  }
  #T(e, t = null) {
    const n = new this.THREE.Vector3(), a = [...this.selected].map((o) => this.models.get(o)).filter((o) => {
      if (!o?.collisionEligible) return !1;
      if (!t) {
        const u = o.coverageBounds ?? o.logicalBounds;
        return !u || !bl(
          e.ray.origin,
          e.ray.direction,
          e.near,
          e.far,
          u
        ) || !o.bounds ? !1 : o.bounds.containsPoint(e.ray.origin) ? !0 : e.ray.intersectBox(o.bounds, n) ? n.distanceTo(e.ray.origin) <= e.far + 1e-6 : !1;
      }
      const c = o.coverageBounds ?? o.logicalBounds;
      if (t.x < c.minX || t.x >= c.maxX || t.z < c.minZ || t.z >= c.maxZ) return !1;
      const d = o.bounds;
      return !d || t.x >= d.min.x - 4 && t.x <= d.max.x + 4 && t.z >= d.min.z - 4 && t.z <= d.max.z + 4;
    });
    if (t) {
      let o = null;
      for (const c of a)
        if (!(!c?.selected || !c.scene.visible))
          for (const d of c.queryMeshes ?? c.meshes) {
            const u = this.#Q(
              c,
              d,
              t.x,
              t.z,
              e.ray.origin.y,
              e.near,
              e.far
            );
            u && (!o || u.distance < o.distance) && (o = u);
          }
      if (o) return o;
    }
    if (!t && Number.isFinite(e.far) && e.far <= 64) {
      let o = null;
      for (const c of a)
        if (!(!c?.selected || !c.scene.visible))
          for (const d of c.queryMeshes ?? c.meshes) {
            const u = this.#J(c, d, e);
            u && (!o || u.distance < o.distance) && (o = u);
          }
      return o;
    }
    const i = /* @__PURE__ */ new Map(), r = [];
    for (const o of a)
      for (const c of o.queryMeshes ?? o.meshes)
        r.push(c), i.set(c, o);
    const l = e.intersectObjects(r, !1);
    for (const o of l) {
      const c = i.get(o.object);
      if (!c?.selected || !c.scene.visible) continue;
      const d = c.coverageBounds ?? c.logicalBounds;
      if (o.point.x < d.minX || o.point.x >= d.maxX || o.point.z < d.minZ || o.point.z >= d.maxZ) continue;
      const u = o.face?.normal?.clone();
      if (u && u.applyNormalMatrix(new this.THREE.Matrix3().getNormalMatrix(o.object.matrixWorld)).normalize(), !this.#d(c, o.point.x, o.point.z, o.point.y, u?.y))
        return xl({
          point: { x: o.point.x, y: o.point.y, z: o.point.z },
          normal: u ? { x: u.x, y: u.y, z: u.z } : void 0,
          distance: o.distance,
          primitiveIndex: c.meshes.indexOf(o.object),
          triangleIndex: o.faceIndex
        }, c);
    }
    return null;
  }
  #$(e) {
    const t = oe(e), n = this.models.get(e), a = this.logicalBoundsForId(e), i = n?.bounds ? (n.bounds.min.x + n.bounds.max.x) * 0.5 : (a.minX + a.maxX) * 0.5, r = n?.bounds ? (n.bounds.min.z + n.bounds.max.z) * 0.5 : (a.minZ + a.maxZ) * 0.5, l = (b, x, m) => {
      const v = this.models.get(`${t.zoom}/${b}/${x}/0`);
      return v?.bounds ? m === "x" ? (v.bounds.min.x + v.bounds.max.x) * 0.5 : (v.bounds.min.z + v.bounds.max.z) * 0.5 : null;
    }, o = 2 ** (20 - t.zoom), c = l(t.x, t.y + 1, "x"), d = l(t.x, t.y - 1, "x"), u = l(t.x - 1, t.y, "z"), h = l(t.x + 1, t.y, "z"), f = c != null && c < i ? c : null, p = d != null && d > i ? d : null, y = u != null && u < r ? u : null, g = h != null && h > r ? h : null;
    return {
      minX: f == null ? i - pt * o * 0.5 : (i + f) * 0.5,
      maxX: p == null ? i + pt * o * 0.5 : (i + p) * 0.5,
      minZ: y == null ? r - mt * o * 0.5 : (r + y) * 0.5,
      maxZ: g == null ? r + mt * o * 0.5 : (r + g) * 0.5
    };
  }
  #ee(e, t) {
    const n = e.transitionParentId, a = this.#$(n ?? e.id), i = oe(e.id), r = new Set(this.ownership.transitions?.[n]?.expected ?? [e.id]), l = (p, y, g, b) => {
      const x = `${i.zoom}/${p}/${y}/0`;
      if (!t.has(x) || !r.has(x)) return null;
      const m = this.models.get(x);
      if (!m?.bounds) return null;
      const v = g === "x" ? (e.bounds.min.x + e.bounds.max.x) * 0.5 : (e.bounds.min.z + e.bounds.max.z) * 0.5, w = g === "x" ? (m.bounds.min.x + m.bounds.max.x) * 0.5 : (m.bounds.min.z + m.bounds.max.z) * 0.5;
      return b < 0 && w >= v || b > 0 && w <= v ? null : (v + w) * 0.5;
    }, o = l(i.x, i.y + 1, "x", -1), c = l(i.x, i.y - 1, "x", 1), d = l(i.x - 1, i.y, "z", -1), u = l(i.x + 1, i.y, "z", 1);
    o != null && (a.minX = o), c != null && (a.maxX = c), d != null && (a.minZ = d), u != null && (a.maxZ = u);
    const h = `${n ?? e.id}:${a.minX.toFixed(4)}:${a.maxX.toFixed(4)}:${a.minZ.toFixed(4)}:${a.maxZ.toFixed(4)}`;
    if (e.clipOwnerId === h) return;
    const f = qn(this.THREE, a, ut);
    e.coverageBounds = a, e.clipOwnerId = h, e.clipPlanes = f;
    for (const p of e.meshes)
      for (const y of Array.isArray(p.material) ? p.material : [p.material])
        y.clippingPlanes = f;
    for (const p of e.oceanSkirts)
      for (const y of Array.isArray(p.material) ? p.material : [p.material])
        y.clippingPlanes = f;
    e.oceanBacking && (this.#u(e, a), e.oceanBacking.mesh.material.clippingPlanes = f), e.companion?.material && (e.companion.material.clippingPlanes = f), e.companionDepth?.material && (e.companionDepth.material.clippingPlanes = f);
  }
  #o(e, t = !1) {
    if (!e || e.disposed || !t && (e.selected || e.pinCount > 0)) return !1;
    if (!t && e.column?.key) {
      const n = e.column.key;
      if (this.columnEvictions.has(n)) return this.#o(e, !0);
      const a = [...this.models.values()].filter((i) => i.column?.key === e.column.key);
      if (a.some((i) => i.selected || i.pinCount > 0)) return !1;
      this.columnEvictions.add(n);
      try {
        const i = this.#o(e, !0);
        for (const r of a) {
          if (r === e || r.disposed) continue;
          const l = this.layers.get(r.zoom);
          l?.lruCache?.has?.(r.tile) ? (l.lruCache.remove(r.tile), this.metrics.columnSiblingEvictions++) : this.#o(r, !0);
        }
        return i;
      } finally {
        this.columnEvictions.delete(n);
      }
    }
    this.#ie(e, e.visualReady, !1), e.visualReady = !1, e.disposed = !0;
    if (e.zoom === 20 && e.transitionParentId) {
      const t = (this.z20ParentResidentCounts.get(e.transitionParentId) ?? 1) - 1;
      t > 0 ? this.z20ParentResidentCounts.set(e.transitionParentId, t) : this.z20ParentResidentCounts.delete(e.transitionParentId);
    }
    const n = this.stagedContentTiles.get(e.id);
    return n && (n.lastEvictedAt = this.now()), this.projectedCoverageJobs.delete(e.id), e.projectedCoverageGeneration++, e.companionRetryTimer != null && clearTimeout(e.companionRetryTimer), e.companionController?.abort(de("Model disposed")), e.companion && this.splats.dispose(e.companion), e.companionDepth = null, e.scene.removeFromParent(), e.oceanBacking && (e.oceanBacking.mesh.removeFromParent(), e.oceanBacking.mesh.geometry?.dispose?.(), e.oceanBacking.mesh.material?.dispose?.()), e.scene.traverse((a) => {
      if (a.isMesh) {
        (a.userData.convertedReplacementGeometry || a.userData.convertedSuppressionGeometry || a.userData.convertedOceanSkirtGeometry) && a.geometry?.dispose?.();
        for (const i of Array.isArray(a.material) ? a.material : [a.material]) this._releaseSourceTextureBytes(i?.map), i?.dispose?.();
      }
    }), this.residentByteStats.sourceIndicesReferenced = Math.max(0, this.residentByteStats.sourceIndicesReferenced - Number(e.sourceIndexReferencedBytes || 0)), this.residentByteStats.sourceIndicesOwned = Math.max(0, this.residentByteStats.sourceIndicesOwned - Number(e.sourceIndexOwnedBytes || 0)), e.sourceScene.visible = !1, this.models.delete(e.id), this.modelsByZoom.get(e.zoom)?.delete(e), this.splatModels.delete(e), this.selected.delete(e.id), this.metrics.disposals++, !0;
  }
  #t() {
    if (this.disposed) throw new Error("ConvertedWorldSession is disposed");
  }
  #te() {
    const e = this.traversalCamera, t = this.camera;
    if (this.prepareFocus) {
      const n = this.prepareFocus, a = Number.isFinite(n.y) ? n.y : 0;
      e.position.set(n.x + 80, a + 120, n.z + 80), e.up.set(0, 1, 0), e.lookAt(n.x, a, n.z), "near" in e && (e.near = Math.min(e.near || 0.4, 0.4)), "far" in e && (e.far = 520), "fov" in e && (e.fov = 38), e.updateProjectionMatrix?.(), e.updateMatrixWorld(!0);
      return;
    }
    const n = this.liveFocus ?? this.focus ?? this.demandFocus;
    if (n) {
      const a = Math.max(0, this.now() - (this.startedAt ?? this.now())), i = Math.min(6500, 700 + a * 0.08), r = this.locomotion === "flight" || this.locomotion === "glider" ? Math.min(6500, Math.max(3200, 1400 + this.horizontalSpeed * 24)) : this.horizontalSpeed > 8 ? 1400 + this.horizontalSpeed * 70 : 0, l = this.coarseTraversalRadius = Math.max(i, r), o = this.traversalTarget, c = o ? o.x - n.x : 0, d = o ? o.z - n.z : 0, u = Math.hypot(c, d), h = Math.min(u, l * 0.18), f = n.x + (u > 1e-4 ? c / u * h : 0), p = n.z + (u > 1e-4 ? d / u * h : 0), y = Number.isFinite(n.y) ? n.y : 0, g = l / Math.tan(36 * Math.PI / 180);
      e.position.set(f, y + g, p), e.up.set(0, 0, -1), e.lookAt(f, y, p), "near" in e && (e.near = 0.4), "far" in e && (e.far = g + Math.max(1200, l * 1.35)), "fov" in e && (e.fov = 72), "aspect" in e && (e.aspect = 1), e.updateProjectionMatrix?.(), e.updateMatrixWorld(!0);
      return;
    }
    t.updateWorldMatrix?.(!0, !1), t.getWorldPosition && t.getWorldQuaternion ? (t.getWorldPosition(e.position), t.getWorldQuaternion(e.quaternion)) : (e.position.copy(t.position), e.quaternion.copy(t.quaternion)), e.updateMatrixWorld(!0);
  }
}
function Pl(s, e = {}) {
  return new kl({ ...s, ...e });
}
export {
  Dl as CONVERTED_WORLD_MIGRATION_READY,
  zn as CONVERTED_WORLD_SESSION_VERSION,
  kl as ConvertedWorldSession,
  Pl as createConvertedWorldSession,
  Pl as default
};
