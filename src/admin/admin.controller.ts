import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
    constructor(private readonly AdminService: AdminService) {}

    @Get("/users")
    getUsers() {
        return this.AdminService.getUsers();
    }

    @Post("/apikey/update/:key")
    updateApiKey(@Param() params: any) {
        return this.AdminService.updateApiKey(params.key);
    }

    @Post("/user/block/:id")
    blockUser(@Param() params: any) {
        return this.AdminService.blockUser(params.id);
    }

    @Post("/user/unblock/:id")
    unblockUser(@Param() params: any) {
        return this.AdminService.unblockUser(params.id);
    }

    @Delete("/user/delete/:id")
    deleteUser(@Param() params: any) {
        return this.AdminService.deleteUser(params.id);
    }

}
