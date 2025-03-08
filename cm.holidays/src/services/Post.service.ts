import { Repository } from "typeorm";
import { Post } from "../entities/Post";
import { AppDataSource } from "../data-source";

export class PostService {
  private static postManager: Repository<Post>
    = AppDataSource.getRepository(Post);

  static async findByName(name: string): Promise<Post | null> {
    return this.postManager
      .createQueryBuilder("t_post")
      .where("LOWER(t_post.name) = LOWER(:name)", { name })
      .getOne();
  }

  static async findById(id: string): Promise<Post | null> {
    return this.postManager.findOne({
      select: ["id", "description", "name", "isActive", "service"],
      where: {
        id
      },
      relations: {
        service: true
      }
    });
  }

  static async findPostByServiceId(
    id: string,
    isAdmin = false
  ): Promise<Post[]> {
    return this.postManager.find({
      select: ["id", "description", "name", "isActive"],
      where: {
        isActive: isAdmin ? undefined : !isAdmin,
        service: {
          id
        }
      }
    });
  }

  static async create(post: Post): Promise<Post> {
    return this.postManager.save(post);
  }

  static async toggle(post: Post): Promise<void> {
    await this.postManager.update({
      id: post.id
    }, post);
  }

  static async findAll(): Promise<Post[]> {
    return this.postManager.find(
      {
        select: ["id", "description", "name", "isActive", "service"],
        relations: {
          service: true
        }
      }
    );
  }

  static async update(post: Post): Promise<void> {
    this.postManager.update({
      id: post.id
    }, post);
  }
}