import type { HLJSApi, Language, LanguageFn } from 'highlight.js';
import hljs from 'highlight.js';
import bash from 'highlight.js/lib/languages/bash';
import dos from 'highlight.js/lib/languages/dos';

interface KeywordDefinitions {
  $pattern?: RegExp;
  [keywordType: string]: RegExp | string[] | undefined;
}

// To highlight additional programs/commands, add them to the target language's built_in list.
// Example: add Windows command-line tools to dosKeywordDefinitions.built_in.
// If command names use characters outside \w, set $pattern so highlight.js can tokenize them.
const bashKeywordDefinitions = {
  built_in: ['apt', 'ip', 'nano', 'puttygen', 'systemctl'],
} satisfies KeywordDefinitions;

const dosKeywordDefinitions = {
  $pattern: /\b[a-z][a-z0-9._-]*\b/,
  built_in: ['ssh-keygen', 'winscp.com'],
} satisfies KeywordDefinitions;

const bashLanguageAliases = ['sh', 'zsh'];

function withCustomKeywords(language: Language, keywordDefinitions: KeywordDefinitions): Language {
  const { keywords } = language;

  if (typeof keywords !== 'object' || Array.isArray(keywords)) return language;

  for (const [keywordType, customKeywords] of Object.entries(keywordDefinitions)) {
    if (keywordType === '$pattern') {
      if (customKeywords instanceof RegExp) Object.assign(keywords, { $pattern: customKeywords });
      continue;
    }

    if (!Array.isArray(customKeywords)) continue;

    const currentKeywords = keywords[keywordType];
    const currentKeywordList = Array.isArray(currentKeywords)
      ? currentKeywords
      : String(currentKeywords ?? '').split(/\s+/);
    const mergedKeywords = new Set(currentKeywordList.filter(Boolean));

    for (const keyword of customKeywords) mergedKeywords.add(keyword);

    keywords[keywordType] = Array.from(mergedKeywords);
  }

  return language;
}

function createCustomLanguage(languageFn: LanguageFn, keywordDefinitions: KeywordDefinitions): LanguageFn {
  return (hljsApi: HLJSApi): Language => withCustomKeywords(languageFn(hljsApi), keywordDefinitions);
}

const customBashLanguage = createCustomLanguage(bash, bashKeywordDefinitions);
const customDosBaseLanguage = createCustomLanguage(dos, dosKeywordDefinitions);

const customDosLanguage: LanguageFn = (hljsApi: HLJSApi): Language => {
  const language = customDosBaseLanguage(hljsApi);

  return {
    ...language,
    aliases: ['bat'],
  };
};

const cmdSessionLanguage: LanguageFn = (): Language => ({
  name: 'Command Prompt Session',
  contains: [
    {
      className: 'meta.prompt',
      begin: /^\s{0,3}(?:[A-Za-z]:\\[^>\r\n]*)?> ?/,
      starts: {
        end: /$/,
        subLanguage: 'dos',
      },
    },
  ],
});

hljs.registerLanguage('bash', customBashLanguage);
hljs.registerAliases(bashLanguageAliases, { languageName: 'bash' });
hljs.registerLanguage('dos', customDosLanguage);
hljs.registerLanguage('cmd', cmdSessionLanguage);
