export function ab2b64(arrbuf: ArrayBuffer): string {
  const buf = new Uint8Array(arrbuf);
  let s: string = '';
  for (let i = 0; i < buf.length; i++) {
    s = s + String.fromCharCode(buf[i]);
  }
  return window.btoa(s);
}

export function b642ab(str64: string): ArrayBuffer {
  const str: string = window.atob(str64);
  var buf = new ArrayBuffer(str.length);
  var bufView = new Uint8Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}
