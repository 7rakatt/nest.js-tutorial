import { PartialType } from "@nestjs/mapped-types";
import { creatBookmarkDto } from "./creatBookmark.dto";


export class updateBookmarkDto extends PartialType(creatBookmarkDto){}