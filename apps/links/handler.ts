import { LinksController } from "./controller/links.controller";

const linksController = new LinksController();

export const create = async (event: any) => linksController.create(event);

export const redirect = async (event: any) => linksController.redirect(event);

export const deactivate = async (event: any) =>  linksController.deactivate(event);

export const list = async (event: any) =>  linksController.findAll(event);