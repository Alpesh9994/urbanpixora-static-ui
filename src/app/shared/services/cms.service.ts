import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface CmsItem {
    [key: string]: any;
}

export interface CmsSection {
    id: string;
    type: string;
    name: string;
    order: number;
    fields: Record<string, any>;
    items: CmsItem[];
}

export interface CmsPage {
    id: string;
    slug: string;
    title: string;
    meta_title: string;
    meta_description: string;
    sections: CmsSection[];
}

@Injectable({
    providedIn: 'root'
})
export class CmsService {

    getPage(slug: string): Observable<CmsPage> {
        const titleCase = slug.charAt(0).toUpperCase() + slug.slice(1);
        return of({
            id: slug,
            slug: slug,
            title: `${titleCase} | UrbanPixora`,
            meta_title: `${titleCase} | UrbanPixora`,
            meta_description: `UrbanPixora ${titleCase} page.`,
            sections: []
        });
    }

    // Helper method to extract a specific section by its type
    getSection(page: CmsPage, type: string): CmsSection | undefined {
        return page?.sections?.find(s => s.type === type);
    }
}
