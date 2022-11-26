type T = {
  a: string
  c?: boolean
  d: 'some desc\n\\n'
  e: {
    f: string
    g: true
  }
}

//   _?
type T0 = T['a']
//   ^?

type T2 = T['e']['f']
//   ^?
//           ^x2?
//               ^x3?

// @4,4?
