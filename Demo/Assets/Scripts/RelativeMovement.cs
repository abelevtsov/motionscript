using UnityEngine;

[RequireComponent(typeof(CharacterController))]
public class RelativeMovement : MonoBehaviour
{
    public float moveSpeed = 6.0F;
    public float rotSpeed = 15.0F;
    public float jumpSpeed = 15.0F;
    public float gravity = -9.8F;
    public float terminalVelocity = -20.0F;
    public float minFall = -1.5F;

    private float vertSpeed;
    private ControllerColliderHit contact;

    private CharacterController charController;
    private Animator animator;

    [SerializeField]
    private Transform target;

    void Start()
    {
        vertSpeed = minFall;

        charController = GetComponent<CharacterController>();
        animator = GetComponent<Animator>();
    }

    void Update()
    {
        var movement = Vector3.zero;
        var horizInput = Input.GetAxis("Horizontal");
        var vertInput = Input.GetAxis("Vertical");

        if (!(horizInput == 0 && vertInput == 0))
        {
            movement.x = horizInput * moveSpeed;
            movement.z = vertInput * moveSpeed;
            movement = Vector3.ClampMagnitude(movement, moveSpeed);

            var tmp = target.rotation;
            target.eulerAngles = new Vector3(0, target.eulerAngles.y, 0);
            movement = target.TransformDirection(movement);
            target.rotation = tmp;

            var direction = Quaternion.LookRotation(movement);
            transform.rotation = Quaternion.Lerp(transform.rotation, direction, rotSpeed * Time.deltaTime);
        }

        animator.SetFloat("Speed", movement.sqrMagnitude);

        var hitGround = false;
        RaycastHit hit;
        if (vertSpeed < 0 && Physics.Raycast(transform.position, Vector3.down, out hit))
        {
            var check = (charController.height + charController.radius) / 1.9F;
            hitGround = hit.distance <= check;
        }

        if (hitGround)
        {
            if (Input.GetButtonDown("Jump"))
            {
                vertSpeed = jumpSpeed;
            }
            else
            {
                vertSpeed = minFall;
                animator.SetBool("Jumping", false);
            }
        }
        else
        {
            vertSpeed += gravity * 5 * Time.deltaTime;
            if (vertSpeed < terminalVelocity)
            {
                vertSpeed = terminalVelocity;
            }

            if (contact != null )
            {
                animator.SetBool("Jumping", true);
            }

            if (charController.isGrounded)
            {
                if (Vector3.Dot(movement, contact.normal) < 0)
                {
                    movement = contact.normal * moveSpeed;
                }
                else
                {
                    movement += contact.normal * moveSpeed;
                }
            }
        }

        movement.y = vertSpeed;

        movement *= Time.deltaTime;
        charController.Move(movement);
    }

    void OnControllerColliderHit(ControllerColliderHit hit)
    {
        contact = hit;
    }
}
