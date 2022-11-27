from typing import Generic, Literal, Optional, TypeVar, TypedDict

D = TypedDict('D', {
    'e': int,
    'f': Optional[str],
})

T = TypedDict('T', {
    'a': int,
    'b': Optional[str],
    'c': Literal["foo", "bar", 'some\ndesc\\n'],
    'd': D,
})

KT = TypeVar('KT')

class F(Generic[KT]):
    kt: KT
    def __init__(self, kt: KT):
        self.kt = kt

if __name__ == 'main':
    t = T(a=1, b=None, c='foo', d={
        'e': 1,
        'f': None,
    })
    _a = t['a']
    #^?
    _b = t['b']
    #^?
    _c = t['c']
    #^?
    _d = t['d']
    #^?
    f_kt = F(1).kt
    #^?
