package main

import (
	"fmt"
)

type T struct {
	A int
	B string
	C
}

type C struct {
	D bool
}

func Fuo[T string | int](t T) T {
	return t
}

func main() {
	fmt.Println("Hello, world!")
	//  ^?
	t := T{A: 1, B: "2", C: C{D: true}}
	a := t.A
	//     ^?
	b := t.B
	//     ^?
	c := t.C
	//     ^?
	fmt.Println(a, b, c)
	fuoResult := Fuo("123")
	// ^?
	fmt.Println(fuoResult)
}
