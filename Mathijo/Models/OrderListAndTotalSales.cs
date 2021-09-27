using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mathijo.Models
{
    public class OrderListAndTotalSales
    {
        public OrderListAndTotalSales(IEnumerable<object> orderList, decimal totalSales)
        {
            this.OrderList = orderList;
            this.TotalSales = totalSales;
        }

        public IEnumerable<object> OrderList { get; set; }
        public decimal TotalSales { get; set; }

    }
}
