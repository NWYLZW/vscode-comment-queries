/**
 * @type {{
 *   a: string;
 *   c?: boolean;
 *   d: 'some desc\n\\n';
 *   e: {
 *     f: string;
 *     g: true;
 *   };
 * }}
 */
const T = {};

//    _?
const T0 = T['a'];
//    ^?

const T2 = T['e']['f']
//    ^?
//            ^x2?
//                ^x3?

// @12,7?
