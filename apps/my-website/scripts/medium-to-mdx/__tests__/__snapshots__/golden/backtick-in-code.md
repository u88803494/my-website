## 解決方案：

從這裡發現只要使用 [Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) 就可以解決這個問題，也就是需要文字的部分寫下：

```
{`
  內容
  xxx
  xxx
`}
```

但是利用 `<pre>` 標籤的話，連寫 code 的空白都會被納入，這樣如果需要文字置中就會跑板，那解決方法就是使用 CSS 屬性即可。

```
white-space: pre-line;
text-align: center;
```

利用 `pre-line` 就不會出現空白，這樣就可以置中了