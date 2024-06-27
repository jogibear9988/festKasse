import { AbstractPropertiesService, IDesignItem, IProperty, IPropertyGroup, PropertyType } from "@node-projects/web-component-designer";
import { ArticleTable } from "../../article-table.js";
import { RefreshMode } from "@node-projects/web-component-designer/dist/elements/services/propertiesService/IPropertiesService.js";
import { BookButton } from "../../../controls/book-button.js";
import { ActionButton } from "../../../controls/action-button.js";
import { applicationConfig } from "../../../applicationConfig.js";

export class FestKassePropertiesService extends AbstractPropertiesService {
    getRefreshMode(designItem: IDesignItem): RefreshMode {
        return RefreshMode.full;
    }

    isHandledElement(designItem: IDesignItem): boolean {
        if (designItem.name === BookButton.is)
            return true;
        if (designItem.name === ActionButton.is)
            return true;
        return false;
    }

    async getProperties(designItem: IDesignItem): Promise<IProperty[] | IPropertyGroup[]> {
        if (designItem.name === BookButton.is)
            return [{
                name: 'article',
                type: 'list',
                values: applicationConfig.articles.map(x => x.key),
                service: this,
                propertyType: PropertyType.propertyAndAttribute
            }];
        if (designItem.name === ActionButton.is)
            return [{
                name: 'action',
                type: 'list',
                values: ['storno', 'clear', 'print', 'open'],
                service: this,
                propertyType: PropertyType.propertyAndAttribute
            }];
        return null;
    }
}