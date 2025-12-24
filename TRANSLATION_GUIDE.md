# 翻译贡献指南

感谢您对 EasyCV 国际化工作的贡献!本指南将帮助您为 EasyCV 添加新的语言支持或改进现有翻译。

## 当前支持的语言

- 🇨🇳 简体中文 (zh-CN) - 默认语言
- 🇺🇸 英语 (en-US)

## 添加新语言

### 1. 创建语言文件

在 `src/i18n/locales/` 目录下创建新的语言文件,文件名格式为 `{语言代码}.ts`,例如 `ja-JP.ts` (日语)、`fr-FR.ts` (法语)等。

```typescript
// src/i18n/locales/ja-JP.ts
export default {
  app: {
    title: 'EasyCV',
    clear: 'クリア',
    clearData: 'データをクリア',
    exportJSON: 'JSONをエクスポート',
    importJSON: 'JSONをインポート',
    exportPDF: 'PDFをエクスポート',
    exporting: 'エクスポート中...',
    switchLanguage: '言語を切り替え',
    clearConfirm: 'すべてのデータをクリアしてもよろしいですか?現在のデータをJSONファイルに保存したことを確認してください。',
    exportFailed: 'PDFのエクスポートに失敗しました。もう一度お試しください',
    importFailed: 'JSONの解析に失敗しました'
  },
  editor: {
    sections: {
      basics: '基本情報',
      education: '学歴',
      work: '職歴',
      projects: 'プロジェクト',
      skills: 'スキル',
      awards: '受賞歴',
      misc: 'その他'
    },
    // ... 其他翻译
  }
}
```

### 2. 注册新语言

在 `src/i18n/index.ts` 中导入并注册新语言:

```typescript
import zhCN from './locales/zh-CN'
import enUS from './locales/en-US'
import jaJP from './locales/ja-JP' // 新增

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
    'ja-JP': jaJP // 新增
  }
})
```

### 3. 更新语言切换UI

在 `src/App.vue` 的语言菜单中添加新语言选项:

```vue
<button 
  @click="setLanguage('ja-JP')" 
  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
  :class="{ 'bg-gray-50 font-medium text-blue-600': locale === 'ja-JP' }"
>
  日本語
</button>
```

### 4. 更新类型定义

在 `src/i18n/index.ts` 的 `setLocale` 函数中添加新语言类型:

```typescript
export function setLocale(locale: 'zh-CN' | 'en-US' | 'ja-JP') {
  i18n.global.locale.value = locale
  localStorage.setItem('locale', locale)
}
```

## 翻译结构说明

语言文件采用嵌套对象结构,主要分为以下几个部分:

### app
应用级别的文本,包括:
- 标题、按钮文本
- 提示信息
- 确认对话框文本

### editor.sections
编辑器各个section的标题

### editor.basics
基本信息表单的字段标签

### editor.education
教育经历表单的字段标签和按钮文本

### editor.work
工作经历表单的字段标签和按钮文本

### editor.projects
项目经历表单的字段标签和按钮文本

### editor.skills
技能表单的字段标签和按钮文本

### editor.awards
获奖情况表单的字段标签和按钮文本

### editor.misc
其他信息表单的字段标签和按钮文本

### common
通用文本,如"移除"、"添加"等

## 翻译规范

1. **保持一致性**: 相同含义的词汇在整个应用中应使用相同的翻译
2. **简洁明了**: 翻译应简洁,避免冗长的表达
3. **符合习惯**: 使用目标语言的惯用表达方式
4. **保留格式**: 保持占位符、变量等特殊标记不变
5. **测试验证**: 添加翻译后,务必在应用中测试显示效果

## 测试新语言

1. 启动开发服务器:
   ```bash
   npm run dev
   ```

2. 在浏览器中打开应用

3. 点击语言切换按钮,选择新添加的语言

4. 检查所有页面和功能,确保:
   - 所有文本都正确显示
   - 没有遗漏的翻译(显示为key)
   - 布局没有因文本长度变化而错乱
   - 语言切换流畅,无闪烁

## 改进现有翻译

如果您发现现有翻译有误或可以改进,请:

1. 在对应的语言文件中找到需要修改的key
2. 修改翻译文本
3. 测试修改后的效果
4. 提交Pull Request

## 提交贡献

1. Fork本仓库
2. 创建新分支: `git checkout -b add-language-ja`
3. 提交更改: `git commit -am 'Add Japanese translation'`
4. 推送到分支: `git push origin add-language-ja`
5. 创建Pull Request

## 需要帮助?

如果您在翻译过程中遇到问题,欢迎:
- 提交Issue
- 在Pull Request中提问
- 查看现有语言文件作为参考

感谢您的贡献! 🎉
