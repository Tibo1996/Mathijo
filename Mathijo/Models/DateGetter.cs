using DatabaseHelper;
using MathijoAssembly;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Mathijo.Models
{
    public static class DateGetter
    {
        public static DateTime[] DailySalesDates()
        {
            DateTime dateFrom = new(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, 0, 0, 0);
            DateTime dateUntil = dateFrom.AddDays(1);
            return new DateTime[] { dateFrom, dateUntil };
        }

        public static DateTime[] WeeklySalesDates()
        {
            DateTime dateFrom = DateTime.Today.AddDays(-1 * DateGetter.GetDayOfTheWeek());
            DateTime dateUntil = dateFrom.AddDays(7);
            return new DateTime[] { dateFrom, dateUntil };
        }

        public static DateTime[] MonthlySalesDates()
        {
            DateTime dateFrom = new(DateTime.Now.Year, DateTime.Now.Month, 1, 0, 0, 0);
            DateTime dateUntil = dateFrom.AddDays(DateTime.DaysInMonth(DateTime.Now.Year, DateTime.Now.Month));
            return new DateTime[] { dateFrom, dateUntil };
        }

        public static DateTime[] YearlySalesDates()
        {
            DateTime dateFrom = new(DateTime.Now.Year, 1, 1, 0, 0, 0);
            DateTime dateUntil = dateFrom.AddYears(1);
            return new DateTime[] { dateFrom, dateUntil };
        }

        public static int GetDayOfTheWeek()
        {
            int indexOfStartWeek = (int)DateTime.Today.DayOfWeek;
            switch (indexOfStartWeek)
            {
                case 0:
                    indexOfStartWeek = 6;
                    break;
                case 1:
                    indexOfStartWeek = 0;
                    break;
                case 2:
                    indexOfStartWeek = 1;
                    break;
                case 3:
                    indexOfStartWeek = 2;
                    break;
                case 4:
                    indexOfStartWeek = 3;
                    break;
                case 5:
                    indexOfStartWeek = 4;
                    break;
                case 6:
                    indexOfStartWeek = 5;
                    break;
            }
            return indexOfStartWeek;
        }

        public static decimal SaleFinder(DateTime dateFrom, DateTime dateUntil)
        {
            decimal totalSales = 0;
            List<W_Bestellungen> bestellungen = DBHelper.SelectAll<W_Bestellungen>().Where(x => x.Bestelldatum > dateFrom && x.Bestelldatum < dateUntil).ToList();
            foreach (W_Bestellungen bestellung in bestellungen)
            {
                W_Bestellte_Produkte bestellteProdukteTemplate = new();
                bestellteProdukteTemplate.ID_Bestellung = bestellung.ID;
                List<W_Bestellte_Produkte> bestellteProdukte = DBHelper.Select(bestellteProdukteTemplate).ToList();
                foreach (W_Bestellte_Produkte bestelltesProdukt in bestellteProdukte)
                {
                    S_Produkte produkt = DBHelper.SelectByID<S_Produkte>((Guid)bestelltesProdukt.ID_Produkt);
                    totalSales += (int)bestelltesProdukt.Menge * (decimal)produkt.Preis;
                }
            }
            return totalSales;
        }
    }
}
