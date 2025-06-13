# TODO List TypeScript

TypeScriptで作成されたシンプルなTODOリスト管理ツールです。JSONファイルでデータを永続化し、優先度管理や統計機能を提供します。

## セットアップ

```bash
npm install
```

## 使い方

### 開発モード（デモを実行）

```bash
npm run dev
```

### TODOの追加

```bash
npm run dev add "タスクのタイトル" "詳細説明" "優先度"
```

例：
```bash
npm run dev add "プロジェクト完成" "TypeScriptプロジェクトを完成させる" "high"
npm run dev add "買い物" "牛乳とパンを買う" "low"
```

### TODOの一覧表示

```bash
npm run dev list
```

### TODOの完了切り替え

```bash
npm run dev toggle <ID>
```

### TODOの削除

```bash
npm run dev delete <ID>
```

## 機能

- **CRUD操作**: TODOの作成、読み取り、更新、削除
- **優先度管理**: high、medium、lowの3段階
- **データ永続化**: JSONファイルでの自動保存
- **統計情報**: 完了率や優先度別の集計
- **日時管理**: 作成日時と更新日時の自動記録
- **コマンドライン**: 直感的なCLIインターフェース

## データ構造

```typescript
interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  priority: "low" | "medium" | "high";
}
```

## ファイル

- `todos.json`: TODOデータの保存ファイル（自動生成）

## API

### TodoList クラス

- `addTodo(title, description, priority)`: 新しいTODOを追加
- `toggleTodo(id)`: TODOの完了状態を切り替え
- `deleteTodo(id)`: TODOを削除
- `updateTodo(id, updates)`: TODOを更新
- `getAllTodos()`: 全てのTODOを取得
- `getStats()`: 統計情報を取得

## 例

```typescript
import { TodoList } from "./src/index";

const todoList = new TodoList();
const todo = todoList.addTodo("新しいタスク", "説明", "high");
console.log(todo.id); // 1
```