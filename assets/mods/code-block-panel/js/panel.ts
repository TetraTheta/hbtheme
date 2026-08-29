import { default as params } from '@params';
import hljs from 'highlight.js';
import snackbar from 'mods/snackbar/js/index.ts';
import './highlight-languages';
import i18n from './i18n';

const isTrue = (val: string | boolean): boolean => {
  if (typeof val === 'boolean') {
    return val;
  }
  return val !== '' && val !== 'false' && val !== '0';
};

const buttonLabelKeys: Record<string, string> = {
  copy: 'copy_code',
  wrap: 'toggle_line_wrapping',
  ln: 'toggle_line_numbers',
  expand: 'toggle_code_block',
};

const buttonLabelFallbacks: Record<string, string> = {
  copy: 'Copy code',
  wrap: 'Toggle line wrapping',
  ln: 'Toggle line numbers',
  expand: 'Expand or collapse code block',
};

export default class Panel {
  private highlight: HTMLElement;
  private pre: HTMLElement;
  private wrapper: HTMLElement;
  private ele: HTMLElement;

  constructor(private code: HTMLElement) {}

  init() {
    this.highlightCode();
    this.wrapLinesSafely();

    const highlight = this.code.closest('.highlight');
    this.pre = this.code.parentElement as HTMLElement;
    this.highlight = this.pre.parentElement as HTMLElement;

    if (!isTrue(highlight?.getAttribute('data-line-nos') ?? params.line_nos)) {
      this.code.classList.add('code-no-ln');
    }
    if (isTrue(highlight?.getAttribute('data-wrap') ?? params.wrap)) {
      this.code.classList.add('code-wrap');
    }

    this.lineNoLayout();

    this.ele = document.createElement('div');
    this.ele.className = 'code-block-panel';

    this.wrapper = document.createElement('div');
    this.wrapper.className = 'code-block-panel-wrapper';
    this.wrapper.appendChild(this.ele);

    this.maxLines();
    this.title();
    if (isTrue(highlight?.getAttribute('data-expand') ?? params.expand)) {
      this.expand();
    }
    this.lineNoButton();
    this.wrapButton();
    this.expandButton();
    this.copyButton();

    this.pre.appendChild(this.wrapper);
  }

  // Returns the lines of code block.
  private lines(): Array<HTMLElement> {
    return Array.from(this.code.querySelectorAll(':scope > .code-line'));
  }

  private highlightCode() {
    this.code.textContent = (this.code.textContent ?? '').replace(/\r\n?/g, '\n').replace(/\n$/, '');

    try {
      hljs.highlightElement(this.code);
      this.displayHighlightLanguageName();
    } catch (err) {
      console.error(err);
    }
  }

  private displayHighlightLanguageName(): void {
    const lang = this.code.getAttribute('data-lang');
    const languageName = lang ? hljs.getLanguage(lang)?.name : undefined;

    if (languageName) {
      this.code.setAttribute('data-lang', languageName);
    }
  }

  private wrapLinesSafely() {
    try {
      this.wrapLines();
    } catch (err) {
      console.error(err);
      this.wrapPlainLines();
    }
  }

  private wrapLines() {
    const highlightedNodes = Array.from(this.code.childNodes);
    const lines = [this.createLine()];

    const appendToken = (lineContent: HTMLElement, parents: Array<HTMLElement>, text: string) => {
      if (parents.length === 0) {
        lineContent.appendChild(document.createTextNode(text));
        return;
      }

      let target = lineContent;
      parents.forEach((parent) => {
        const clone = parent.cloneNode(false) as HTMLElement;
        target.appendChild(clone);
        target = clone;
      });
      target.appendChild(document.createTextNode(text));
    };

    const appendNode = (node: Node, parents: Array<HTMLElement>) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const parts = (node.textContent ?? '').split('\n');
        parts.forEach((part, i) => {
          appendToken(lines[lines.length - 1].content, parents, part);
          if (i < parts.length - 1) {
            lines.push(this.createLine());
          }
        });
        return;
      }

      if (node instanceof HTMLElement) {
        const nextParents = [...parents, node];
        Array.from(node.childNodes).forEach((child) => {
          appendNode(child, nextParents);
        });
      }
    };

    highlightedNodes.forEach((node) => {
      appendNode(node, []);
    });

    const firstLineNo = this.firstLineNo();

    this.code.replaceChildren();
    lines.forEach(({ line }, i) => {
      line.prepend(this.createLineNo(firstLineNo + i));
      this.code.appendChild(line);
    });
  }

  private wrapPlainLines() {
    const lines = (this.code.textContent ?? '').split('\n');
    const firstLineNo = this.firstLineNo();

    this.code.replaceChildren();
    lines.forEach((text, i) => {
      const { line, content } = this.createLine();

      line.prepend(this.createLineNo(firstLineNo + i));
      content.appendChild(document.createTextNode(text));
      this.code.appendChild(line);
    });
  }

  private createLine(): { line: HTMLElement; content: HTMLElement } {
    const line = document.createElement('span');
    const content = document.createElement('span');

    line.className = 'code-line';
    content.className = 'code-line-content';
    line.appendChild(content);

    return { line, content };
  }

  private createLineNo(lineNo: number): HTMLElement {
    const ln = document.createElement('span');

    ln.className = 'ln';
    ln.textContent = String(lineNo);
    ln.setAttribute('aria-label', String(lineNo));

    return ln;
  }

  private firstLineNo(): number {
    const lineNoStart = Number.parseInt(this.code.closest('.highlight')?.getAttribute('data-line-no-start') ?? '1', 10);

    return Number.isFinite(lineNoStart) ? lineNoStart : 1;
  }

  private lineNoLayout(): void {
    const lineCount = this.lines().length;
    const firstLineNo = this.firstLineNo();
    const lastLineNo = firstLineNo + Math.max(lineCount - 1, 0);
    const maxLineNoLength = Math.max(String(firstLineNo).length, String(lastLineNo).length, 1);

    this.code.style.setProperty('--code-line-no-width', `${maxLineNoLength}ch`);
    this.code.querySelectorAll(':scope > .code-line > .ln').forEach((ln) => {
      ln.textContent = (ln.getAttribute('aria-label') ?? '').padStart(maxLineNoLength, ' ');
    });
  }

  private maxHeight: string;

  private maxLines() {
    const lines = this.lines();
    const maxLines = this.code.closest('.highlight')?.getAttribute('data-max-lines') ?? params.max_lines;
    if (maxLines > 0 && lines.length > maxLines) {
      const offsetTop = lines[maxLines].offsetTop;
      if (offsetTop > 0) {
        this.pre.style.maxHeight = this.maxHeight = offsetTop + 'px';
      }
    }
  }

  // Display the title
  private title() {
    const title = this.highlight.getAttribute('data-title');
    if (title === null) {
      return;
    }

    this.code.setAttribute('data-title', title);
  }

  private button(name: string, callback: CallableFunction): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.className = 'code-block-action code-block-action-' + name;
    btn.title = i18n.translate(buttonLabelKeys[name] ?? name, null, buttonLabelFallbacks[name] ?? name);
    btn.setAttribute('aria-label', btn.title);
    btn.innerHTML = params.icons[name];
    btn.addEventListener('click', () => {
      callback();
    });
    return btn;
  }

  private copyButton() {
    const btn = this.button('copy', () => {
      this.copy();
    });
    this.ele.appendChild(btn);
  }

  private copy() {
    const text = this.lines()
      .map((line) => {
        const clone = line.cloneNode(true) as HTMLElement;

        clone.querySelectorAll('.ln').forEach((ln) => {
          ln.remove();
        });

        return clone.textContent ?? '';
      })
      .join('\n');

    navigator.clipboard
      .writeText(text)
      .then(() => {
        snackbar.add(i18n.translate('copied', null, 'Copied!'));
      })
      .catch((err) => {
        snackbar.add(i18n.translate('copy_failed', null, 'Copy failed.'));
        console.error(err);
      });
  }

  private wrapButton() {
    const btn = this.button('wrap', () => {
      this.toggleClass('code-wrap');
    });
    this.ele.appendChild(btn);
  }

  private toggleClass(className: string) {
    if (this.code.classList.contains(className)) {
      this.code.classList.remove(className);
      return;
    }

    this.code.classList.add(className);
  }

  private lineNoButton() {
    const btn = this.button('ln', () => {
      this.toggleClass('code-no-ln');
    });
    this.ele.appendChild(btn);
  }

  private expandButton() {
    const btn = this.button('expand', () => {
      this.expand();
    });
    this.ele.appendChild(btn);
  }

  private expand() {
    if (!this.pre.style.maxHeight && !this.maxHeight) {
      return;
    }

    if (this.pre.style.maxHeight) {
      this.pre.style.maxHeight = '';
      return;
    }

    this.pre.style.maxHeight = this.maxHeight;
  }
}
