import React, { Component } from 'react'
import styles from './CartOverlay.module.css'

import { Link } from 'react-router-dom'

import { SectionContainer } from '../../context/context'

import { formatCurrency } from '../../utils/formatCurrency'
import { isAttributeActive } from '../../utils/isAttributeActive'

import cartIcon from '../../assets/cart.svg'

class CartOverlay extends Component {
   constructor(props) {
      super(props)
      this.cartWrapperRef = React.createRef()
   }

   handleClickOutside = (event) => {
      if (
         this.cartWrapperRef &&
         !this.cartWrapperRef.current.contains(event.target) &&
         this.props.context.cartOpen
      ) {
         this.props.context.toggleMiniCart(false)
         console.log('clicked outside')
      }
   }

   componentDidMount() {
      document.addEventListener('mousedown', this.handleClickOutside)
   }

   componentWillUnmount() {
      document.removeEventListener('mousedown', this.handleClickOutside)
   }
   render() {
      const {
         cart,
         selectedCurrency,
         increaseCartQuantity,
         decreaseCartQuantity,
         getPriceIndex,
         cartQuantity,
         totalPrice,
         toggleMiniCart,
         cartOpen,
      } = this.props.context
      return (
         <>
            {cartOpen && <div className={styles.overlay}></div>}
            <div className={styles.cartContainer} ref={this.cartWrapperRef}>
               <button
                  className={styles.cartIcon}
                  onClick={() => toggleMiniCart(!cartOpen)}
               >
                  <img src={cartIcon} alt='cart-icon' />
                  {cartQuantity > 0 && (
                     <div className={styles.cartQuantity}>{cartQuantity}</div>
                  )}
               </button>
               {cartOpen && (
                  <aside className={styles.cartOverlay}>
                     <div className={styles.title}>
                        <span>My Bag,</span>
                        {cartQuantity === 1
                           ? ` ${cartQuantity} item`
                           : ` ${cartQuantity} items`}
                     </div>
                     {cart?.length > 0 ? (
                        <>
                           <div className={styles.cartItems}>
                              {cart?.map?.((product) => {
                                 const {
                                    uniqueId,
                                    name,
                                    brand,
                                    prices,
                                    gallery,
                                    attributes,
                                    selectedAttributes,
                                    quantity,
                                 } = product

                                 const priceIndex = getPriceIndex(prices)

                                 return (
                                    <section
                                       key={uniqueId}
                                       className={styles.cartItem}
                                    >
                                       <div className={styles.productDetails}>
                                          <h6>{brand}</h6>
                                          <h6>{name}</h6>
                                          <h5 className={styles.price}>{`${
                                             selectedCurrency.symbol
                                          } ${formatCurrency(
                                             prices[priceIndex].amount
                                          )}`}</h5>
                                          {attributes.length > 0 && (
                                             <div className={styles.attributes}>
                                                {attributes?.map(
                                                   (attribute) => {
                                                      const {
                                                         items,
                                                         type,
                                                         id,
                                                         name,
                                                      } = attribute
                                                      return (
                                                         <div
                                                            className={
                                                               styles.singleAttribute
                                                            }
                                                            key={id}
                                                         >
                                                            <h5
                                                               className={
                                                                  styles.attributeTitle
                                                               }
                                                            >
                                                               {`${name}:`}
                                                            </h5>
                                                            <div
                                                               className={
                                                                  styles.labelGroup
                                                               }
                                                            >
                                                               {items?.map?.(
                                                                  (item) => {
                                                                     const attributeToSelect =
                                                                        {
                                                                           name,
                                                                           type,
                                                                           value: item.value,
                                                                        }
                                                                     return (
                                                                        <div
                                                                           key={
                                                                              item.id
                                                                           }
                                                                           className={`${
                                                                              type ===
                                                                              'swatch'
                                                                                 ? styles.swatchAttr
                                                                                 : styles.txtAttr
                                                                           } ${
                                                                              isAttributeActive(
                                                                                 attributeToSelect,
                                                                                 selectedAttributes
                                                                              ) &&
                                                                              styles.active
                                                                           }`}
                                                                        >
                                                                           {type ===
                                                                           'swatch' ? (
                                                                              <i
                                                                                 style={{
                                                                                    background:
                                                                                       item.value,
                                                                                    border:
                                                                                       item?.value ===
                                                                                       '#FFFFFF'
                                                                                          ? '0.5px solid #1d1f22'
                                                                                          : '',
                                                                                    width: '100%',
                                                                                    display:
                                                                                       'block',
                                                                                    height:
                                                                                       '100%',
                                                                                 }}
                                                                              ></i>
                                                                           ) : (
                                                                              item.value
                                                                           )}
                                                                        </div>
                                                                     )
                                                                  }
                                                               )}
                                                            </div>
                                                         </div>
                                                      )
                                                   }
                                                )}
                                             </div>
                                          )}
                                       </div>
                                       <div className={styles.gallerySection}>
                                          <div className={styles.quantityBtns}>
                                             <button
                                                onClick={() =>
                                                   increaseCartQuantity(product)
                                                }
                                             >
                                                +
                                             </button>
                                             <div className={styles.quantity}>
                                                {quantity}
                                             </div>
                                             <button
                                                onClick={() =>
                                                   decreaseCartQuantity(
                                                      uniqueId
                                                   )
                                                }
                                                className={styles.minus}
                                             >
                                                _
                                             </button>
                                          </div>
                                          <div className={styles.gallery}>
                                             <img
                                                src={gallery?.[0]}
                                                alt={name}
                                             />
                                          </div>
                                       </div>
                                    </section>
                                 )
                              })}
                           </div>

                           <div className={styles.totalPriceSection}>
                              <h4>Total</h4>
                              <h3>
                                 {` ${selectedCurrency.symbol} ${formatCurrency(
                                    totalPrice
                                 )}`}
                              </h3>
                           </div>
                        </>
                     ) : (
                        <div className={styles.miniCartEmpty}>
                           <h4>Nothing Here - Add Something</h4>
                        </div>
                     )}
                     <div className={styles.miniCartBtns}>
                        <Link
                           to='/cart'
                           className={styles.bagBtn}
                           onClick={() => toggleMiniCart(false)}
                        >
                           View bag
                        </Link>
                        <Link
                           to='/cart'
                           className={styles.bagBtn}
                           onClick={() => toggleMiniCart(false)}
                        >
                           CHECK OUT
                        </Link>
                     </div>
                  </aside>
               )}
            </div>
         </>
      )
   }
}

export default SectionContainer(CartOverlay)
