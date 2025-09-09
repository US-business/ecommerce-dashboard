<div className="flex justify-center mt-8" >
    {/* Numbered Pagination with ellipses */ }
    < Pagination >
    <PaginationContent>
    {/* Previous */ }
    < PaginationItem >
    <PaginationPrevious
                                            href="#"
aria - disabled={ page === 1 }
className = { page === 1 ? "pointer-events-none opacity-50" : ""}
onClick = {(e) => {
    e.preventDefault();
    if (page === 1) return;
    setPage(page - 1);
    window.scroll({ top: 0, behavior: "smooth" });
}}
                                        />
    </>

{/* Page numbers */ }
{
    (() => {
        const items: (number | "ellipsis")[] = []
        const maxToShow = 5 // window size around current
        const add = (v: number | "ellipsis") => items.push(v)
        const first = 1
        const last = totalPages
        const start = Math.max(first, page - 2)
        const end = Math.min(last, page + 2)

        // Always show first
        add(first)
        if (start > first + 1) add("ellipsis")

        for (let p = start; p <= end; p++) {
            if (p !== first && p !== last) add(p)
        }

        if (end < last - 1) add("ellipsis")
        if (last > first) add(last)

        return items.map((it, idx) => (
            it === "ellipsis" ? (
                <PaginationItem key= {`el-${idx}`}>
    <PaginationEllipsis />
    </PaginationItem>
                                            ) : (
        <PaginationItem key= { it } >
        <PaginationLink
                                                        href="#"
    isActive = { page === it
}
onClick = {(e) => {
    e.preventDefault();
    if (page === it) return;
    setPage(it)
    window.scroll({ top: 0, behavior: "smooth" })
}}
                                                    >
    { it }
    </PaginationLink>
    </PaginationItem>
                                            )
                                        ))
                                    }) ()}

{/* Next */ }
<PaginationItem>
    <PaginationNext
                                            href="#"
aria - disabled={ page >= totalPages }
className = { page >= totalPages ? "pointer-events-none opacity-50" : ""}
onClick = {(e) => {
    e.preventDefault();
    if (page >= totalPages) return;
    setPage(page + 1);
    window.scroll({ top: 0, behavior: "smooth" });
}}
                                        />
    </PaginationItem>
    </PaginationContent>
    </Pagination>
    </div>











    <!-- ///////////////////////////////////////////// --> image

        <Image src={product.image} fill sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' alt={product.nameEn} className="object-contain" />

       <div className="absolute inset-0 bg-linear-to-r from-gray-50 via-30% via-black/60  to-60% to-gray-50 z-0" /> 
