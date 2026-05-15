import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
    {
        method: "GET",
        path: buildRoutePath("/users"),
        handler: (req, res) => {
            const { search } = req.query;

            const users = database.select(
                "users",
                search
                    ? {
                          name: search,
                          email: search,
                      }
                    : null,
            );

            return res.end(JSON.stringify(users));
        },
    },
    {
        method: "POST",
        path: buildRoutePath("/users"),
        handler: (req, res) => {
            const { name, email } = req.body;

            const user = {
                id: randomUUID(),
                name,
                email,
            };

            database.insert("users", user);

            return res.writeHead(201).end();
        },
    },
    {
        method: "PUT",
        path: buildRoutePath("/users/:id"),
        handler: (req, res) => {
            const { id } = req.params;
            const { name, email } = req.body;

            database.update("users", id, {
                name,
                email,
            });

            return res.writeHead(204).end();
        },
    },
    {
        method: "DELETE",
        path: buildRoutePath("/users/:id"),
        handler: (req, res) => {
            const { id } = req.params;

            database.delete("users", id);

            return res.writeHead(204).end();
        },
    },
    {
        method: "POST",
        path: buildRoutePath("/tasks"),
        handler: (req, res) => {
            const { title, description } = req.body;
            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date(),
                updated_at: new Date(),
            };
            database.insert("tasks", task);
            return res.writeHead(201).end();
        },
    },
    {
        method: "GET",
        path: buildRoutePath("/tasks"),
        handler: (req, res) => {
            const { search } = req.query;
            const tasks = database.select(
                "tasks",
                search
                    ? {
                          title: search,
                          description: search,
                      }
                    : null,
            );
            return res.end(JSON.stringify(tasks));
        },
    },
    {
        method: "PUT",
        path: buildRoutePath("/tasks/:id"),
        handler: (req, res) => {
            const { id } = req.params;
            const getTaskById = database.select("tasks", {
                id: id,
            });
            if (getTaskById.length < 1) {
                return res.writeHead(404).end();
            }

            const { title, description } = req.body;
            database.update("tasks", id, {
                title: title ? title : getTaskById.title,
                description: description
                    ? description
                    : getTaskById.description,
                updated_at: new Date(),
            });

            return res.writeHead(204).end();
        },
    },
    {
        method: "DELETE",
        path: buildRoutePath("/tasks/:id"),
        handler: (req, res) => {
            const { id } = req.params;
            const verifyTasksExistsById = database.select("tasks", { id: id });
            if (verifyTasksExistsById.length < 1) {
                return res.writeHead(404).end();
            }
            database.delete("tasks", id);
            return res.writeHead(204).end();
        },
    },
    {
        method: "PATCH",
        path: buildRoutePath("/tasks/:id/completea"),
        handler: (req, res) => {
            const { id } = req.params;
            const verifyTaskExistsById = database.select("tasks", {
                id: id,
            });
            if (verifyTaskExistsById.length < 1) {
                return res.writeHead(404).end();
            }
            const date = new Date();
            database.update("tasks", id, {
                completed_at: date,
            });
            return res.writeHead(201).end();
        },
    },
];
