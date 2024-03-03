import { expect, test } from 'bun:test'
import { transform } from './transformer'

test('Transformer is working', async () => {
  const result = await transform(
    {
      transform(data) {
        return {
          data
        }
      }
    },
    undefined
  )
  console.log(result)
  expect(result).toEqual({
    data: undefined
  })
})
