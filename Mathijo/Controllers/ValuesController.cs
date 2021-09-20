using DatabaseHelper;
using MathijoAssembly;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace Mathijo.Controllers
{
    public record OrderData(Guid ID_Produkt, Guid ID_Bestellung);
    [ApiController]
    [Route("[controller]")]
    public class ValuesController : Controller
    {
        [HttpGet("GetAllProductTypes")]
        public IEnumerable<object> GetAllProductTypes()
        {
            return DBHelper.SelectAll<S_Produkt_Arten>().OrderBy(x => x.Reihenfolge);
        }

        [HttpGet("GetTables")]
        public IEnumerable<object> GetTables()
        {
            return DBHelper.SelectAll<S_Tische>().OrderBy(x => x.Tischnummer);
        }

        [HttpPost("GetProductsOfProductType")]
        public IEnumerable<object> GetProductsOfProductType(Guid idProductType)
        {
            S_Produkte produkt = new();
            produkt.ID_Produkt_Art = idProductType;
            return DBHelper.Select(produkt);
        }

        [HttpPost("CreateNewOrder")]
        public Guid? CreateNewOrder(Guid idTisch)
        {
            W_Bestellungen bestellung = new()
            {
                ID = Guid.NewGuid(),
                ID_Tisch = idTisch,
                Bestelldatum = DateTime.Now,
                Abgeschlossen = false
            };
            DBHelper.Insert(bestellung);
            return bestellung.ID;
        }

        [HttpGet("GetOrderForTable")]
        public IEnumerable<object> GetOrderForTable()
        {
            return DBHelper.SelectAll<W_Bestellungen>().Where(x => x.Abgeschlossen == false);
        }

        [HttpPost("CreateOrderedProduct")]
        public Guid? CreateOrderedProduct(OrderData orderData)
        {
            W_Bestellte_Produkte bestelltesProdukt = new()
            {
                ID = Guid.NewGuid(),
                ID_Produkt = orderData.ID_Produkt,
                ID_Bestellung = orderData.ID_Bestellung,
                Menge = 1,
                Bezahlt = false
            };
            DBHelper.Insert(bestelltesProdukt);
            return bestelltesProdukt.ID;
        }

        [HttpGet("UpdateOrderedProductPlus")]
        public void UpdateOrderedProductPlus(Guid idOrderedProduct)
        {
            W_Bestellte_Produkte bestelltesProdukt = DBHelper.SelectByID<W_Bestellte_Produkte>(idOrderedProduct);
            bestelltesProdukt.Menge++;
            DBHelper.Update(bestelltesProdukt);
        }

        [HttpGet("UpdateOrderedProductMinus")]
        public void UpdateOrderedProductMinus(Guid idOrderedProduct)
        {
            W_Bestellte_Produkte bestelltesProdukt = DBHelper.SelectByID<W_Bestellte_Produkte>(idOrderedProduct);
            bestelltesProdukt.Menge--;
            DBHelper.Update(bestelltesProdukt);
        }

        [HttpGet("DeleteOrderedProduct")]
        public void DeleteOrderedProduct(Guid idOrderedProduct)
        {
            DBHelper.Delete<W_Bestellte_Produkte>(idOrderedProduct);
        }

        [HttpGet("GetOrderedProducts")]
        public IEnumerable<object> GetOrderedProducts(Guid idOrder)
        {
            W_Bestellte_Produkte bestellteProdukte = new()
            {
                ID_Bestellung = idOrder,
                Bezahlt = false
            };
            return DBHelper.Select(bestellteProdukte);
        }

        [HttpGet("GetProductByID")]
        public object GetProductByID(Guid idProduct)
        {
            return DBHelper.SelectByID<S_Produkte>(idProduct);
        }

        [HttpGet("FinishOrder")]
        public void FinishOrder(Guid idOrder)
        {
            W_Bestellungen bestellung = DBHelper.SelectByID<W_Bestellungen>(idOrder);
            bestellung.Abgeschlossen = true;
            W_Bestellte_Produkte bestelltesProdukt = new()
            {
                ID_Bestellung = bestellung.ID
            };
            IEnumerable<W_Bestellte_Produkte> bestellteProdukte = DBHelper.Select(bestelltesProdukt);
            foreach (W_Bestellte_Produkte bp in bestellteProdukte)
            {
                bp.Bezahlt = true;
                DBHelper.Update(bp);
            }
            DBHelper.Update(bestellung);
        }

        [HttpGet("UpdateOrderedProductPaid")]
        public void UpdateOrderedProductPaid(Guid idOrderedProduct)
        {
            W_Bestellte_Produkte bestelltesProdukt = DBHelper.SelectByID<W_Bestellte_Produkte>(idOrderedProduct);
            bestelltesProdukt.Bezahlt = true;
            DBHelper.Update(bestelltesProdukt);
        }

        [HttpGet("GetAllOrderedProducts")]
        public IEnumerable<object> GetAllOrderedProducts()
        {
            return DBHelper.SelectAll<W_Bestellte_Produkte>();
        }

        [HttpGet("GetUmsatzGesamt")]
        public float GetUmsatzGesamt()
        {
            float gesamterUmsatz = 0.00f;
            IEnumerable<W_Bestellungen> bestellungen = DBHelper.SelectAll<W_Bestellungen>();
            foreach (W_Bestellungen bestellung in bestellungen)
            {
                W_Bestellte_Produkte bestelltesProduktTemplate = new();
                bestelltesProduktTemplate.ID_Bestellung = bestellung.ID;
                IEnumerable<W_Bestellte_Produkte> bestellteProdukte = DBHelper.Select<W_Bestellte_Produkte>(bestelltesProduktTemplate);
                foreach (W_Bestellte_Produkte bestelltesProdukt in bestellteProdukte)
                {
                    S_Produkte produkt = DBHelper.SelectByID<S_Produkte>((Guid)bestelltesProdukt.ID_Produkt);
                    gesamterUmsatz += float.Parse((produkt.Preis * bestelltesProdukt.Menge).ToString());
                }
            }
            return gesamterUmsatz;
        }

        [HttpGet("GetUmsatzBetweenTime")]
        public float GetUmsatzBetweenTime(DateTime dateFrom, DateTime dateUntil)
        {
            float gesamterUmsatz = 0.00f;
            IEnumerable<W_Bestellungen> bestellungen = DBHelper.SelectAll<W_Bestellungen>()
                .Where(x => x.Bestelldatum > dateFrom && x.Bestelldatum < dateUntil);
            foreach (W_Bestellungen bestellung in bestellungen)
            {
                W_Bestellte_Produkte bestelltesProduktTemplate = new()
                {
                    ID_Bestellung = bestellung.ID
                };
                IEnumerable<W_Bestellte_Produkte> bestellteProdukte = DBHelper.Select<W_Bestellte_Produkte>(bestelltesProduktTemplate);
                foreach (W_Bestellte_Produkte bestelltesProdukt in bestellteProdukte)
                {
                    S_Produkte produkt = DBHelper.SelectByID<S_Produkte>((Guid)bestelltesProdukt.ID_Produkt);
                    gesamterUmsatz += float.Parse((produkt.Preis * bestelltesProdukt.Menge).ToString());
                }
            }
            return gesamterUmsatz;
        }

        [HttpGet("GetOrderedProductsPerOrder")]
        public IEnumerable<object> GetOrderedProductsPerOrder(Guid idOrder)
        {
            W_Bestellte_Produkte bestelltesProdukt = new()
            {
                ID_Bestellung = idOrder
            };
            return DBHelper.Select<W_Bestellte_Produkte>(bestelltesProdukt);
        }
    }
}
