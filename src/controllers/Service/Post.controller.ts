import { NextFunction, Request, Response } from "express";
import { asyncWrapper } from "../requestHanlder";
import { PostService } from "../../services/Post.service";
import { ApiError } from "../../middlewares/errors/Api";
import { StatusCodes } from "http-status-codes";
import { CompanyService } from "../../services/Company.service";
import { Post } from "../../entities/Post";
import { regulariseSpacesFrom } from "../../utils/commons";
import {
  COMMONS_ERRORS_CODES,
  POST_ERRORS_CODES,
  PostDTO,
  SERVICE_ERRORS_CODES,
  ServiceDTO
} from "../../entities/types";

export class PostController {

  private static async getPostByName(name: string)
    : Promise<PostDTO | null> {
    return PostService
      .findByName(regulariseSpacesFrom(name));
  }

  static async create(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<string> {
    return await asyncWrapper(async () => {
      const {
        name,
        description,
        service: { id }
      } = request.body;
      const existingPost = await PostController
        .getPostByName(regulariseSpacesFrom(name));

      if (existingPost) {
        throw new ApiError(StatusCodes.CONFLICT,
          COMMONS_ERRORS_CODES.CONFLICTS);
      }

      const serviceOfPost = await CompanyService.findServiceById(id);

      if (!serviceOfPost) {
        throw new ApiError(StatusCodes.NOT_FOUND,
          SERVICE_ERRORS_CODES.NOT_FOUND);
      }

      let newPost = new Post();
      newPost.name = regulariseSpacesFrom(name);
      newPost.service = serviceOfPost;
      newPost.isActive = false;
      if (description?.trim())
        newPost.description = regulariseSpacesFrom(description);

      newPost = await PostService.create(newPost);

      response.status(StatusCodes.CREATED).json(newPost.id);

    })(request, response, next);
  }

  static async getPostByServiceId(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<string> {
    return await asyncWrapper(async () => {
      const service = await CompanyService.findServiceById(request.params.id);

      if (!service) {
        throw new ApiError(StatusCodes.NOT_FOUND,
          SERVICE_ERRORS_CODES.NOT_FOUND);
      }

      const { isAdmin, isHumanResource  } = response.locals.roles;
      const posts = await PostService
        .findPostByServiceId(
          service.id,
          isAdmin || !isHumanResource
        );

      return response.status(StatusCodes.OK).json(posts);
    })(request, response, next);
  }

  static async togglePost(request: Request,
    response: Response,
    next: NextFunction): Promise<Response<ServiceDTO>> {
    return await asyncWrapper(async () => {

      const { id }  = request.params;
      const isActivation = request.path.split("/").includes("activate");

      const serviceOfPost = await CompanyService.findServiceByPostId(id);
      if (!serviceOfPost) {
        throw new ApiError(StatusCodes.NOT_FOUND,
          SERVICE_ERRORS_CODES.NOT_FOUND);
      }

      if (!serviceOfPost.isActive) {
        throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY,
          SERVICE_ERRORS_CODES.NOT_ACTIVE);
      }

      const post = await PostService.findById(id);
      if (!post) {
        throw new ApiError(StatusCodes.NOT_FOUND, POST_ERRORS_CODES.NOT_FOUND);
      }

      if (isActivation) {
        if (post.isActive) {
          throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY,
            COMMONS_ERRORS_CODES.ALREADY_IN_THAT_STATE);
        }
      } else {
        if (!post.isActive) {
          throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY,
            COMMONS_ERRORS_CODES.ALREADY_IN_THAT_STATE);
        }
      }

      post.isActive = isActivation;
      await PostService.toggle(post);

      return response.sendStatus(StatusCodes.NO_CONTENT);
    })(request, response, next);
  }

  static async getAll(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<Response<PostDTO[]>> {
    return await asyncWrapper(async () => {
      const posts = await PostService.findAll();
      return response.status(StatusCodes.OK).json(posts);
    })(request, response, next);
  }

  static async edit(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<string> {
    return await asyncWrapper(async (): Promise<Response<string>> => {
      const post = await PostService.findById(request.params.id);

      if (!post) {
        throw new ApiError(StatusCodes.NOT_FOUND,
          POST_ERRORS_CODES.NOT_FOUND);
      }
      const { name, description, service: { id } } = request.body;
      const otherPostWithSameName = await PostController
        .getPostByName(name);

      if (otherPostWithSameName) {
        if (post.id !== otherPostWithSameName?.id) {
          throw new ApiError(StatusCodes.CONFLICT,
            SERVICE_ERRORS_CODES.ANOTHER_EXIST_WITH_SAME_NAME);
        }
      }

      if (id) {
        const service = await CompanyService.findServiceById(id);

        if (!service) {
          throw new ApiError(StatusCodes.NOT_FOUND,
            SERVICE_ERRORS_CODES.NOT_FOUND);
        }

        if (!service.isActive) {
          throw new ApiError(StatusCodes.CONFLICT,
            SERVICE_ERRORS_CODES.NOT_ACTIVE);
        }
        post.service = service;
      }

      post.name = regulariseSpacesFrom(name);
      post.description = regulariseSpacesFrom(description);

      await PostService.update(post);
      return response.sendStatus(StatusCodes.NO_CONTENT);
    })(request, response, next);
  }
}