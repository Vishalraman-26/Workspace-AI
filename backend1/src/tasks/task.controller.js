import taskService from "./task.service.js";
import { success, failure } from "../shared/response.js";

class TaskController {

    async getTasks(req, res) {

        try {

            const tasks = await taskService.getTasks(req.user.id);

            return res.status(200).json(
                success(tasks, "Tasks fetched successfully")
            );

        } catch (error) {

            return res.status(error.statusCode || 500).json(
                failure(error.message)
            );

        }

    }

    async getTaskById(req, res) {

        try {

            const task = await taskService.getTaskById(
                req.user.id,
                req.params.id
            );

            return res.status(200).json(
                success(task, "Task fetched successfully")
            );

        } catch (error) {

            return res.status(error.statusCode || 500).json(
                failure(error.message)
            );

        }

    }

    async createTask(req, res) {

        try {

            const task = await taskService.createTask(
                req.user.id,
                req.body
            );

            return res.status(201).json(
                success(task, "Task created successfully")
            );

        } catch (error) {

            return res.status(error.statusCode || 500).json(
                failure(error.message)
            );

        }

    }

    async updateTask(req, res) {

        try {

            const task = await taskService.updateTask(
                req.user.id,
                req.params.id,
                req.body
            );

            return res.status(200).json(
                success(task, "Task updated successfully")
            );

        } catch (error) {

            return res.status(error.statusCode || 500).json(
                failure(error.message)
            );

        }

    }

    async deleteTask(req, res) {

        try {

            const result = await taskService.deleteTask(
                req.user.id,
                req.params.id
            );

            return res.status(200).json(
                success(result, "Task deleted successfully")
            );

        } catch (error) {

            return res.status(error.statusCode || 500).json(
                failure(error.message)
            );

        }

    }

}

export default new TaskController();