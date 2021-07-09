export class DibujadorBSPlineCuadratico{
    constructor(){
        this.base0 = function(u) { return 0.5*(1-u)*(1-u);}
        this.base1 = function(u) { return 0.5+u*(1-u);} 
        this.base2 = function(u) { return 0.5*u*u; }
        
        this.base0der=function(u) { return -1+u;} 
        this.base1der=function(u) { return  1-2*u;} 
        this.base2der=function(u) { return  u;}

    }

    getVertices(puntosDeControl){
        let delta = 0.1 //debe clavar en 0 y 1
        let lista = []

        for(let paso = 0; paso <= 1; paso+=delta){
            lista.push(this.curva(paso, puntosDeControl))
        }

        return lista;

    }

    getDerivada(u,puntosDeControl){
        var p0=puntosDeControl[0];
		var p1=puntosDeControl[1];
		var p2=puntosDeControl[2];		

		let punto = [];

		let x=this.base0der(u)*p0[0]+this.base1der(u)*p1[0]+this.base2der(u)*p2[0];
        punto.push(x);
        let y=0;
        punto.push(y);

		let z=this.base0der(u)*p0[1]+this.base1der(u)*p1[1]+this.base2der(u)*p2[1];
        punto.push(z);
        
        //punto.push(1);
		return punto;        
    }

  
   //private
    curva=function(u,puntosDeControl){
        var p0=puntosDeControl[0];
        var p1=puntosDeControl[1];
        var p2=puntosDeControl[2];
        
        let punto= []

        let x=this.base0(u)*p0[0]+this.base1(u)*p1[0]+this.base2(u)*p2[0];
        punto.push(x)		
        let y = 0
        punto.push(y)
        let z=this.base0(u)*p0[1]+this.base1(u)*p1[1]+this.base2(u)*p2[1];
        punto.push(z)
        punto.push(1) //w

        return punto;
    }

}