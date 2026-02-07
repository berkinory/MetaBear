---
title: 'Comprehensive Markdown & Features Test'
description: 'A complete test of all markdown features, KaTeX, embeds, and more'
pubDate: '2026-01-26'
keywords: ['markdown', 'test', 'katex', 'embeds']
category: 'test'
---

This post demonstrates all available features including markdown syntax, KaTeX math rendering, embedded content, and more.

---

## Text Formatting

Here's some **bold text**, _italic text_, ~~strikethrough~~, and `inline code`. You can also combine them: **_bold and italic_**, or **`bold code`**.

## Headings

All heading levels are supported (H2-H6 shown above/below).

### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

## Blockquotes

> The best way to predict the future is to invent it.
>
> — Alan Kay

Blockquotes can contain **formatting** and `code` too.

> Nested blockquotes are also possible:
>
> > This is a nested quote
> > with multiple lines

## Lists

### Ordered List

1. First item
2. Second item
3. Third item
   1. Nested item 3.1
   2. Nested item 3.2
4. Fourth item

### Unordered List

- Item A
- Item B
  - Nested item B.1
  - Nested item B.2
    - Double nested B.2.1
- Item C

### Task List

- [x] Completed task
- [x] Another completed task
- [ ] Pending task
- [ ] Another pending task

## Links

Here's a [link to Astro](https://astro.build) and an [internal link](/posts/comprehensive-markdown-test).

## Images

Images are automatically optimized with lazy loading:

![HIKARI](/assets/hikari.jpg)

## Code Blocks

### JavaScript

```javascript
const greeting = (name) => {
  console.log(`Hello, ${name}!`);
  return `Welcome to the blog Welcome to the blog Welcome to the blog Welcome to the blog Welcome to the blog`;
};

greeting('World');
```

### TypeScript

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com'
};
```

### Python

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Generate first 10 Fibonacci numbers
for i in range(10):
    print(fibonacci(i))
```

### CSS

```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}
```

## Tables

| Feature        | Status      | Priority |
| -------------- | ----------- | -------- |
| Markdown       | ✅ Complete | High     |
| KaTeX          | ✅ Complete | High     |
| Embeds         | ✅ Complete | Medium   |
| Syntax Highlighting | ✅ Complete | High     |
| Image Optimization | ✅ Complete | Medium   |

Aligned tables:

| Left | Center | Right |
| :--- | :----: | ----: |
| A    | B      | C     |
| D    | E      | F     |

## Mathematics with KaTeX

Inline math: The quadratic formula is $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$.

Block math:

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

More complex equations:

$$
\begin{aligned}
\nabla \times \vec{\mathbf{B}} -\, \frac1c\, \frac{\partial\vec{\mathbf{E}}}{\partial t} &= \frac{4\pi}{c}\vec{\mathbf{j}} \\
\nabla \cdot \vec{\mathbf{E}} &= 4 \pi \rho \\
\nabla \times \vec{\mathbf{E}}\, +\, \frac1c\, \frac{\partial\vec{\mathbf{B}}}{\partial t} &= \vec{\mathbf{0}} \\
\nabla \cdot \vec{\mathbf{B}} &= 0
\end{aligned}
$$

Matrix notation:

$$
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
\begin{pmatrix}
x \\
y
\end{pmatrix}
=
\begin{pmatrix}
ax + by \\
cx + dy
\end{pmatrix}
$$

## Embedded Content

### YouTube Video

::youtube[dQw4w9WgXcQ]

### Twitter/X Post

::twitter[https://twitter.com/astrodotbuild/status/1750280863584600234]

### CodePen

::codepen[https://codepen.io/team/codepen/pen/PNaGbb]

## Horizontal Rules

You can use horizontal rules to separate sections:

---

Like this one above.

## Footnotes

Here's a sentence with a footnote[^1]. And another one[^2].

[^1]: This is the first footnote with some additional explanation.
[^2]: This is the second footnote referencing a [source](https://example.com).

## Special Elements

### Keyboard Shortcuts

Press <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy and <kbd>Ctrl</kbd> + <kbd>V</kbd> to paste.

Use <kbd>⌘</kbd> + <kbd>Space</kbd> on macOS to open Spotlight.

### Abbreviations

<abbr title="HyperText Markup Language">HTML</abbr> and <abbr title="Cascading Style Sheets">CSS</abbr> are fundamental web technologies.

### Subscript & Superscript

Water is H<sub>2</sub>O and Einstein's formula is E=mc<sup>2</sup>.

### Marked Text

You can <mark>highlight important text</mark> like this.

## Advanced Math Examples

### Calculus

The derivative of $f(x) = x^n$ is:

$$
\frac{d}{dx}(x^n) = nx^{n-1}
$$

### Statistics

The normal distribution probability density function:

$$
f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{1}{2}\left(\frac{x-\mu}{\sigma}\right)^2}
$$

### Linear Algebra

$$
\det(A) = \sum_{j=1}^{n} (-1)^{i+j} a_{ij} M_{ij}
$$

## Conclusion

This post demonstrates all the major features available in the blog including:

- ✅ Complete Markdown support
- ✅ KaTeX mathematical notation
- ✅ Embedded content (YouTube, Twitter, CodePen)
- ✅ Syntax highlighting for code blocks
- ✅ Image handling with lazy loading
- ✅ Tables with alignment
- ✅ Task lists
- ✅ Footnotes
- ✅ Special HTML elements

Everything works seamlessly with clean, simple configuration!
