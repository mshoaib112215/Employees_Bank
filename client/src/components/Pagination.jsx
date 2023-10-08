const Pagination = ({ itemsPerPage, totalItems, currentPage, paginate }) => {
    const pageNumbers = [];
    const maxPageButtons = 3; // Show up to 3 page buttons

    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const renderPageNumbers = () => {
        const minPage = Math.max(currentPage - Math.floor(maxPageButtons / 2), 1);
        const maxPage = Math.min(minPage + maxPageButtons - 1, pageNumbers.length);

        const pageNumbersToRender = [];
        for (let i = minPage; i <= maxPage; i++) {
            pageNumbersToRender.push(i);
        }

        return pageNumbersToRender.map((number) => (
            <li key={number} >
                <button onClick={() => paginate(number)} className={`px-2 py-1 text-md rounded-md ${currentPage === number ? 'bg-blue-500 text-white active:bg-blue-400' : ' hover:bg-gray-300'}`}>
                    {number}
                </button>
            </li>
        ));
    };

    return (
        <nav>
            <ul className="flex gap-2">
                { (
                    <li >
                        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage > 1 ? false : 'true'} className={` text-white rounded-md px-2 py-1 disabled:bg-gray-400 disabled:cursor-not-allowed bg-blue-500 hover:bg-blue-400`}>
                            Previous
                        </button>
                    </li>
                )}
                {renderPageNumbers()}
                {(
                    <li >
                        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage < pageNumbers.length ? false : true} className={`px-2 py-1 rounded-md text-white bg-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-400`}>
                            Next
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Pagination;
