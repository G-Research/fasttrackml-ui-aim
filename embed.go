package aim

import (
	"embed"
	"io/fs"
)

//go:embed embed
var content embed.FS

var FS fs.FS

func init() {
	FS, _ = fs.Sub(content, "embed")
}
