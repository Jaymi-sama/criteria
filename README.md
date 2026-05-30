# Criteria: Visual Query Builder

Criteria is a high-fidelity, highly interactive visual query builder that allows users to construct complex database/API queries through a sharp, professional graphical interface. Built with Next.js 16 and TypeScript, it prioritizes information density, recursive structural integrity, and developer-centric ergonomics.

## 🏗️ Architecture Explanation

The application follows a **Modular Unified Architecture**. It is divided into three distinct layers:
1.  **State Layer (Zustand)**: A centralized, persistent store that manages the recursive query tree, execution history, and user presets.
2.  **Visual Builder Layer (Recursive UI)**: A set of high-density components that map the nested state tree to an interactive logic builder.
3.  **Execution Layer (Query Engine)**: A dual-purpose engine that generates raw syntax (SQL/JSON) and simulates query execution against a mock dataset in real-time.

The project utilizes a **"Draft vs. Applied"** model, where UI edits are stored in a draft state and only propagated to the execution layer upon a manual "Run" trigger, preventing expensive re-renders and providing a more professional IDE-like experience.

## 🔄 Recursive Rendering Strategy

The core of Criteria is its **Infinite Nesting Engine**.
-   **Recursive Components**: The `ConditionGroup` component is designed to render itself. It iterates through its children; if a child is a `rule`, it renders a `ConditionRule`; if it's a `group`, it recursively calls `ConditionGroup`.
-   **Structural Indentation**: Visual hierarchy is maintained through a vertical "Context Line" rather than floating boxes. This line provides a high-contrast guide that connects parents to children across any depth.
-   **Normalization**: On import or restoration, a recursive normalization utility traverses the incoming JSON to "heal" missing IDs or types, ensuring the recursive UI never encounters malformed states.

## 🧠 State Management Decisions

-   **Zustand + Immer**: Chosen for its lightweight footprint and excellent TypeScript support. Immer allows for "mutative" syntax on complex nested trees, significantly reducing the boilerplate required for deep state updates.
-   **Persistence**: Leveraged Zustand's `persist` middleware to ensure query configurations survive page refreshes.
-   **Decoupled State**: Implemented two separate root objects (`rootGroup` and `appliedRootGroup`). This allows users to experiment with complex logic in a "sandbox" mode without affecting the results table or code preview until they are ready.

## ⚙️ Query Engine Design

The query engine is split into two specialized utilities:
1.  **Syntax Generator (`query-generator.ts`)**: A recursive transformer that turns the visual tree into valid SQL strings and MongoDB query objects.
2.  **Logic Executor (`query-executor.ts`)**: A recursive evaluation utility that filters a dataset. It maps human-readable operators (e.g., "Contains") to programmatic logic, supporting nested logical branching (`AND`/`OR`) across any depth.

## 🚀 Performance Optimization Techniques

-   **Manual Execution Model**: By decoupling the "Draft" state from the "Applied" state, we prevent the entire application (including the data table and code preview) from re-processing on every keystroke.
-   **Memoized Inspection**: The results table uses `useMemo` to ensure that local search and sorting only re-run when the `appliedRootGroup` or the search term changes.
-   **Hydration Safety**: Implemented a two-pass rendering pattern to safely transition from server-side rendering to client-side persistent state without layout shifts or "undefined element" errors.
-   **Flat Design System**: Stripped decorative shadows and excessive rounding in favor of a "Flat Design" aesthetic, reducing browser paint complexity and improving visual clarity.

## ⚖️ Trade-offs Made

-   **Native vs. Virtualized Table**: For this prototype, I opted for a native `overflow-y-auto` implementation for the results table. While virtualization would scale better for 100,000+ records, the native approach provided a more robust and theme-consistent scroll experience for the target mock dataset size.
-   **Manual Run Trigger**: While "Auto-filtering" feels faster for simple queries, it can become confusing for complex, multi-level logic. I traded "Auto-updates" for a manual "Run Query" model to give the user total control over the execution heartbeat.
-   **Namespace Imports**: I swapped named imports for namespace imports (`import * as Radix`) across the UI components. This slightly increases the bundle size but was a necessary trade-off to resolve critical "undefined element" regressions in the Turbopack build environment.

---

### 🧪 Getting Started
1. **Install**: `pnpm install`
2. **Dev**: `pnpm dev`
3. **Build**: `pnpm build`
4. **Test**: `pnpm test:ui` (Vitest) or `pnpm e2e` (Playwright)
