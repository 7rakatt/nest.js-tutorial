import { PartialType } from "@nestjs/mapped-types";
import { creatUserDto } from "./creatUser.dto";


export class updateUserDto extends PartialType(creatUserDto) {}