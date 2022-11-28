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

type T2 = T['e']['f'] //<6?
//   ^?
//           ^2?
//               ^3?

// &4,4?

// &./.import0.spec.ts:1:14?
