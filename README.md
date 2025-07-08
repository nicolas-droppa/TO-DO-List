**TaskFlow** is a dynamic and interactive todo list web app that allows users to create, organize, and manage multiple draggable todo lists with colorful customization and persistent storage. It's a playful yet functional productivity tool designed with usability and creativity in mind.

## 📋 Table of Contents
1. [🚀 Features](#features)
2. [🖼️ Screenshots](#screenshots)
3. [📦 Tech Stack](#tech-stack)
4. [💡 Usage](#usage)
5. [💾 Local Storage](#local-storage)
6. [📌 Future Improvements](#future-improvements)
7. [📜 License](#license)

---

## 🚀 Features

- 📝 **Multiple Todo Lists** – Create as many lists as you need, each with its own position, color, and name.
- 🎨 **Color Customization** – Change the color of each list using a modal with preset options.
- ✏️ **Task Management** – Add, edit, complete, and delete tasks easily.
- 📦 **Persistent Storage** – Data is saved using `localStorage`, so your tasks stay even after refreshing the page.
- 🎯 **Draggable Interface** – Move your lists freely across the screen with drag-and-drop.
- 🌙 **Light/Dark Mode Toggle** – Switch between day and night themes for better usability.
- 📚 **Sidebar Overview** – Navigate between lists using a collapsible sidebar that summarizes all current lists.

---

## 🖼️ Screenshots

---

## 📦 Tech Stack

- **HTML5**
- **CSS3** (with CSS variables for theming)
- **Vanilla JavaScript (ES6+)**
- **Font Awesome** for icons
- **LocalStorage API**

---

## 💡 Usage

1. **Create a new list** by clicking the ➕ button in the sidebar.
2. **Drag and drop** lists anywhere on the screen.
3. **Rename lists and tasks** using inline editing.
4. **Change list color** using the 🎨 brush button.
5. **Toggle completion** using the checkbox.
6. **Collapse/expand sidebar** using the angle arrow (`<`/`>`).
7. **Switch themes** with the moon/sun icon.

---

## 💾 Local Storage

TaskFlow uses the browser’s `localStorage` to persist:
- List data (IDs, names, positions, colors)
- Tasks (names and completion status)
- Sidebar toggle state (expanded/collapsed)

No external backend is required.

---

## 📌 Future Improvements

- 🔁 Undo/Redo support
- 🔄 Import/Export list data (JSON)
- 📱 Mobile-friendly layout
- 🔍 Search or filter tasks
- 🗂️ Tag or priority system

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).

---

_Designed and developed with 💻 and ☕ by Nicolas Droppa_  
