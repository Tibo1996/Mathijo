using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mathijo.Models
{
    public class ProductDataForAllOrderedProducts
    {
        public ProductDataForAllOrderedProducts(Guid iD_Product, int amount, string productName, decimal prize)
        {
            this.ID_Product = iD_Product;
            this.Amount = amount;
            this.ProductName = productName;
            this.Prize = prize;
        }

        public Guid ID_Product { get; set; }
        public int Amount { get; set; }
        public string ProductName { get; set; }
        public decimal Prize { get; set; }
    }
}
