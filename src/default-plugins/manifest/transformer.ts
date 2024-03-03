type Transform<T> = {
  transform: {
    (data: unknown): T
  }
}
type TransformAsync<T> = {
  transformAsync: {
    (data: unknown): Promise<T>
  }
}
type EntriesSchema = {
  entries: {
    [key: string | number | symbol]: Schema<any>
  }
  default: any
}
export type Schema<T> = Transform<T> | TransformAsync<T> | EntriesSchema

type Output<SchemaType extends Schema<any>> = SchemaType extends Transform<any>
  ? ReturnType<SchemaType['transform']>
  : SchemaType extends TransformAsync<any>
    ? ReturnType<SchemaType['transformAsync']>
    : SchemaType extends EntriesSchema
      ? {
        [K in keyof SchemaType['entries']]: SchemaType['entries'][K]
      }
      : never
export const schema = <T extends Schema<any>>(schema: T) => schema

export const transform = async <SchemaType extends Schema<any>>(
  schema: SchemaType,
  data: unknown
): Promise<Output<SchemaType>> => {
  if ('default' in schema) {
    if (data === void 0) {
      data = schema.default
    }
    for (const [k, childSchema] of Object.entries(schema.entries)) {
      ;(data as any)[k] = await transform(childSchema, (data as any)[k])
    }
    return data as any
  } else {
    return 'transform' in schema
      ? schema.transform(data)
      : await schema.transformAsync(data)
  }
}
