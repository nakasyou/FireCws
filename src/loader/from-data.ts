import { CrxExtension, type CrxExtensionMetaData } from '..'

export const fromData = async (
  data: Uint8Array | Blob | ReadableStream<Uint8Array> | Response,
  meta?: CrxExtensionMetaData
) => {
  const uint8Array =
    data instanceof Uint8Array
      ? data
      : new Uint8Array(
          await (data instanceof ReadableStream
            ? new Response(data)
            : data
          ).arrayBuffer()
        )
  return new CrxExtension(uint8Array, meta ?? {})
}
