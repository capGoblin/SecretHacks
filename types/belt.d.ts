declare module "@blake.regalia/belt" {
  export function bytes(length: number): Uint8Array;
  export function bytes_to_base64(bytes: Uint8Array): string;
  export function json_to_bytes(json: any): Uint8Array;
  export function sha256(data: Uint8Array): Promise<Uint8Array>;
  export function concat(arrays: Uint8Array[]): Uint8Array;
  export function text_to_bytes(text: string): Uint8Array;
  export function base64_to_bytes(base64: string): Uint8Array;
  // Add any other functions you're using from the package
}
