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

t = T(a=1, b=None, c='foo', d={
    'e': 1,
    'f': None,
})

a = t['a']
#^? [int]

b = t['b']
#^? [Optional[str]]

c = t['c']
#^? [Literal['foo', 'bar', 'some\ndesc\\n']]

d = t['d']
#^? [D]

KT = TypeVar('KT')

class F(Generic[KT]):
    kt: KT
    def __init__(self, kt: KT):
        self.kt = kt

f_kt = F(1).kt
#^? [int]
