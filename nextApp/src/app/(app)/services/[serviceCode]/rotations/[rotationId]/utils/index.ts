export const getMonthAxisLegend = (vesselCode: string) => {
  return `<div class="flex-row items-center vis-axis-legend">  
        <div class="axis-diag">   
               <span>${vesselCode}</span>        
                 <span>month</span>    
                     </div><div false>       
                        <span>voyage</span>          <span>week</span>   
                             </div>   
                                </div>`;
};
export const getDayAxisLegend = (vesselCode: string) => {
  return `<div class="flex-row items-center vis-axis-legend">  
        <div class="axis-diag">   
               <span>${vesselCode}</span>        
                 <span>day</span>    
                     </div><div false>       
                        <span>voyage</span>          <span>hour</span>   
                             </div>   
                                </div>`;
};
