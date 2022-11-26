from typing import Generic, Literal, Optional, TypeVar, TypedDict

T = TypedDict('T', {
    'a': int,
    'b': Optional[str],
    'c': Literal["foo", "bar", 'some\ndesc\\n'],
})

t = T(a=1, b=None, c='foo')

a = t['a']
#^? [int]

b = t['b']
#^? [Optional[str]]

c = t['c']
#^? [Literal['foo', 'bar', 'some\ndesc\\n']]

KT = TypeVar('KT')

class F(Generic[KT]):
    kt: KT
    def __init__(self, kt: KT):
        self.kt = kt

f_kt = F(1).kt
#^? [int]
