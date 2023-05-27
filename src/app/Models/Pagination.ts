
export class Pagination
{

    // Declrations
    total: number;
    current_page: number;
    total_pages: number;
    per_page: number;
    from: number;
    to: number;
    number_of_links: number;
    pagination_links = [];
    offset = 0;
    limit = 10;

    /**
     * @param obj
     * Updates pagination model
     */
    update(obj)
    {
        this.total = obj.total_records;
        this.total_pages = Math.ceil(this.total / this.limit);
        this.number_of_links = 5; // How many page numbers need to show
        this.current_page = (this.offset / this.limit) + 1;
        this.from = this.offset + 1;
        this.to = this.offset + this.limit;
        this.per_page = obj.data.length;
        this.updatePaginationSet();
    }

    /**
     * Updates the pagination set - Start and End page numbers
     */
    updatePaginationSet()
    {
        let start, end;

        // Makes the start number
        if (this.current_page < (this.number_of_links / 2))
            start = 1;
        else
            start = this.current_page - Math.floor(this.number_of_links / 2);

        // Makes the end number
        if ((start + this.number_of_links) > this.total_pages)
        {
            end = this.total_pages;
            start = end - this.number_of_links > 0 ? end - this.number_of_links + 1 : 1;
        }
        else
        {
            end = start + this.number_of_links - 1;
        }

        this.pagination_links = [];

        //Pushes the page numbers in pagination links array
        for (let i = start; i <= end; i++)
        {
            this.pagination_links.push(i);
        }
    }

}
