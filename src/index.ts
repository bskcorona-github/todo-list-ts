// Simple TODO List TypeScript Project
import * as fs from "fs";
import * as path from "path";

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  priority: "low" | "medium" | "high";
}

interface TodoStorage {
  todos: Todo[];
  nextId: number;
}

class TodoList {
  private storageFile: string;
  private storage: TodoStorage;

  constructor(storageFile: string = "todos.json") {
    this.storageFile = storageFile;
    this.storage = this.loadStorage();
  }

  private loadStorage(): TodoStorage {
    try {
      if (fs.existsSync(this.storageFile)) {
        const data = fs.readFileSync(this.storageFile, "utf8");
        const parsed = JSON.parse(data);
        // Dateオブジェクトを復元
        parsed.todos = parsed.todos.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt),
        }));
        return parsed;
      }
    } catch (error) {
      console.error("ストレージファイルの読み込みエラー:", error);
    }

    return { todos: [], nextId: 1 };
  }

  private saveStorage(): void {
    try {
      fs.writeFileSync(this.storageFile, JSON.stringify(this.storage, null, 2));
    } catch (error) {
      console.error("ストレージファイルの保存エラー:", error);
    }
  }

  /**
   * 新しいTODOを追加
   */
  addTodo(
    title: string,
    description: string = "",
    priority: "low" | "medium" | "high" = "medium"
  ): Todo {
    const todo: Todo = {
      id: this.storage.nextId++,
      title: title.trim(),
      description: description.trim(),
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority,
    };

    this.storage.todos.push(todo);
    this.saveStorage();
    return todo;
  }

  /**
   * TODOの完了状態を切り替え
   */
  toggleTodo(id: number): boolean {
    const todo = this.storage.todos.find((t) => t.id === id);
    if (!todo) return false;

    todo.completed = !todo.completed;
    todo.updatedAt = new Date();
    this.saveStorage();
    return true;
  }

  /**
   * TODOを削除
   */
  deleteTodo(id: number): boolean {
    const index = this.storage.todos.findIndex((t) => t.id === id);
    if (index === -1) return false;

    this.storage.todos.splice(index, 1);
    this.saveStorage();
    return true;
  }

  /**
   * TODOを更新
   */
  updateTodo(
    id: number,
    updates: Partial<Pick<Todo, "title" | "description" | "priority">>
  ): boolean {
    const todo = this.storage.todos.find((t) => t.id === id);
    if (!todo) return false;

    if (updates.title !== undefined) todo.title = updates.title.trim();
    if (updates.description !== undefined)
      todo.description = updates.description.trim();
    if (updates.priority !== undefined) todo.priority = updates.priority;

    todo.updatedAt = new Date();
    this.saveStorage();
    return true;
  }

  /**
   * 全てのTODOを取得
   */
  getAllTodos(): Todo[] {
    return [...this.storage.todos];
  }

  /**
   * 完了済みTODOを取得
   */
  getCompletedTodos(): Todo[] {
    return this.storage.todos.filter((todo) => todo.completed);
  }

  /**
   * 未完了TODOを取得
   */
  getPendingTodos(): Todo[] {
    return this.storage.todos.filter((todo) => !todo.completed);
  }

  /**
   * 優先度別TODOを取得
   */
  getTodosByPriority(priority: "low" | "medium" | "high"): Todo[] {
    return this.storage.todos.filter((todo) => todo.priority === priority);
  }

  /**
   * TODOの統計情報を取得
   */
  getStats(): {
    total: number;
    completed: number;
    pending: number;
    byPriority: Record<string, number>;
  } {
    const todos = this.storage.todos;
    return {
      total: todos.length,
      completed: todos.filter((t) => t.completed).length,
      pending: todos.filter((t) => !t.completed).length,
      byPriority: {
        high: todos.filter((t) => t.priority === "high").length,
        medium: todos.filter((t) => t.priority === "medium").length,
        low: todos.filter((t) => t.priority === "low").length,
      },
    };
  }

  /**
   * TODOを整理して表示
   */
  displayTodos(): void {
    const todos = this.getAllTodos();

    if (todos.length === 0) {
      console.log("📝 TODOが登録されていません。");
      return;
    }

    console.log("\n=== TODO リスト ===");

    // 優先度別に表示
    ["high", "medium", "low"].forEach((priority) => {
      const priorityTodos = todos.filter((t) => t.priority === priority);
      if (priorityTodos.length === 0) return;

      console.log(`\n🔥 ${priority.toUpperCase()} 優先度:`);
      priorityTodos.forEach((todo) => {
        const status = todo.completed ? "✅" : "⏳";
        const date = todo.createdAt.toLocaleDateString();
        console.log(`  ${status} [${todo.id}] ${todo.title}`);
        if (todo.description) {
          console.log(`      📄 ${todo.description}`);
        }
        console.log(`      📅 ${date}`);
      });
    });

    // 統計情報を表示
    const stats = this.getStats();
    console.log("\n=== 統計 ===");
    console.log(
      `📊 全体: ${stats.total}件 | 完了: ${stats.completed}件 | 未完了: ${stats.pending}件`
    );
    console.log(
      `🔥 高: ${stats.byPriority.high}件 | 中: ${stats.byPriority.medium}件 | 低: ${stats.byPriority.low}件`
    );
  }
}

// デモンストレーション
function demonstrateTodoList(): void {
  const todoList = new TodoList();

  console.log("=== TODO リスト デモ ===\n");

  // サンプルTODOを追加
  console.log("📝 サンプルTODOを追加中...");
  todoList.addTodo(
    "TypeScriptプロジェクトを完成させる",
    "すべての機能を実装して動作確認",
    "high"
  );
  todoList.addTodo(
    "READMEファイルを作成",
    "プロジェクトの説明とセットアップ手順",
    "medium"
  );
  todoList.addTodo(
    "コードレビューを依頼",
    "チームメンバーにコードレビューを依頼",
    "low"
  );

  // TODOを表示
  todoList.displayTodos();

  // 1つのTODOを完了
  console.log("\n✅ TODO ID 2 を完了にしました...");
  todoList.toggleTodo(2);

  // 更新後の表示
  todoList.displayTodos();
}

// コマンドライン引数処理
function handleCommandLineArgs(): void {
  const args = process.argv.slice(2);
  const todoList = new TodoList();

  if (args.length === 0) {
    demonstrateTodoList();
    return;
  }

  const command = args[0].toLowerCase();

  switch (command) {
    case "add":
      if (args.length < 2) {
        console.log('使用法: npm run dev add "タイトル" ["説明"] [優先度]');
        return;
      }
      const title = args[1];
      const description = args[2] || "";
      const priority = (args[3] as "low" | "medium" | "high") || "medium";
      const todo = todoList.addTodo(title, description, priority);
      console.log(`✅ TODO を追加しました: [${todo.id}] ${todo.title}`);
      break;

    case "list":
      todoList.displayTodos();
      break;

    case "toggle":
      if (args.length < 2) {
        console.log("使用法: npm run dev toggle <ID>");
        return;
      }
      const id = parseInt(args[1]);
      if (todoList.toggleTodo(id)) {
        console.log(`✅ TODO [${id}] の状態を切り替えました`);
      } else {
        console.log(`❌ TODO [${id}] が見つかりません`);
      }
      break;

    case "delete":
      if (args.length < 2) {
        console.log("使用法: npm run dev delete <ID>");
        return;
      }
      const deleteId = parseInt(args[1]);
      if (todoList.deleteTodo(deleteId)) {
        console.log(`🗑️ TODO [${deleteId}] を削除しました`);
      } else {
        console.log(`❌ TODO [${deleteId}] が見つかりません`);
      }
      break;

    default:
      console.log("使用可能なコマンド: add, list, toggle, delete");
  }
}

// メイン実行
if (require.main === module) {
  handleCommandLineArgs();
}

export { TodoList, type Todo };