// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    Injectable,
    OnDestroy,
    ViewChild,
} from "@angular/core";
import { Subscription } from "rxjs";

import {
    INovaFilteringOutputs,
    LocalFilteringDataSource,
    PaginatorComponent,
    SearchComponent,
    SearchService,
} from "@nova-ui/bits";

const RANDOM_ARRAY = [
    { color: "regular-blue" },
    { color: "regular-green" },
    { color: "regular-yellow" },
    { color: "regular-cyan " },
    { color: "regular-magenta" },
    { color: "regular-black" },
    { color: "dark-blue" },
    { color: "dark-green" },
    { color: "dark-yellow" },
    { color: "dark-cyan " },
    { color: "dark-magenta" },
    { color: "dark-black" },
    { color: "light-blue" },
    { color: "light-green" },
    { color: "light-yellow" },
    { color: "light-cyan " },
    { color: "light-magenta" },
    { color: "light-black" },
];

interface ExampleItem {
    color: string;
}

@Injectable()
export class ClientSideCustomSearchService extends SearchService {
    protected filterPredicate(item: any, searchValue: any): boolean {
        return item.toString().indexOf(searchValue.toString()) !== -1;
    }
}

/**
 * TODO: Remove in v12 - NUI-5835
 * @deprecated
 */
@Component({
    selector: "nui-deprecated-client-side-custom-search-example",
    templateUrl: "./client-side-custom-search.example.component.html",
    providers: [
        LocalFilteringDataSource,
        { provide: SearchService, useClass: ClientSideCustomSearchService },
    ],
})
export class DepreacatedDataSourceClientSideCustomSearchExampleComponent
    implements AfterViewInit, OnDestroy
{
    public searchTerm = "";
    public page = 1;

    public state: INovaFilteringOutputs = {
        repeat: {
            itemsSource: [],
        },
        paginator: {
            // @ts-ignore: used for demo purposes
            total: undefined,
        },
    };

    public filters: any[];
    public selectedFilters: any[];

    @ViewChild("filteringPaginator") filteringPaginator: PaginatorComponent;
    @ViewChild("filteringSearch") filteringSearch: SearchComponent;

    private outputsSubscription: Subscription;

    constructor(
        public dataSourceService: LocalFilteringDataSource<ExampleItem>,
        public changeDetection: ChangeDetectorRef
    ) {
        dataSourceService.setData(RANDOM_ARRAY);

        this.filters = ["regular", "dark", "light"];
        this.selectedFilters = [];
    }

    ngAfterViewInit() {
        this.dataSourceService.componentTree = {
            search: {
                componentInstance: this.filteringSearch,
            },
            paginator: {
                componentInstance: this.filteringPaginator,
            },
        };
        this.dataSourceService.applyFilters();
        this.outputsSubscription =
            this.dataSourceService.outputsSubject.subscribe(
                (data: INovaFilteringOutputs) => {
                    this.state = data;
                    if (data && data.paginator && data.paginator.reset) {
                        this.filteringPaginator.page = 1;
                    }
                    this.changeDetection.detectChanges();
                }
            );
    }

    ngOnDestroy() {
        this.outputsSubscription.unsubscribe();
    }

    public onSearch(value: string) {
        this.dataSourceService.applyFilters();
    }

    public changePagination() {
        this.dataSourceService.applyFilters();
    }

    public applyFilters() {
        this.dataSourceService.applyFilters();
    }
}
