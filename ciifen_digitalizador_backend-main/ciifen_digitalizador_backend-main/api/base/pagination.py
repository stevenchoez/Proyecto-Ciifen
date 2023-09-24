from rest_framework.pagination import PageNumberPagination


class Pagination(PageNumberPagination):
    page_size_query_param = "page_size"
    max_page_size = 100

    def get_page_size(self, request):
        if self.page_size_query_param and request.query_params.get("page_size") != "":
            page_size = min(
                int(
                    request.query_params.get(self.page_size_query_param, self.page_size)
                ),
                self.max_page_size,
            )
            if page_size > 0:
                return page_size
            elif page_size == 0:
                return None
        return self.page_size
